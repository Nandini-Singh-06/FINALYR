/* global ace */ // eslint-disable-line no-unused-vars
import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/worker-javascript';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import './CodeEditor.css';

const GPT_KEY = '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';
let stompClient = null;

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws-endpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log("**********************************");
      stompClient.subscribe('/topic/code-updates', (code) => {
      const updatedCode = JSON.parse(code.body);
      setCode(updatedCode);
      });
    });
    const handleCodeChange = (newCode) => {
      setCode(newCode);
      stompClient.send('/app/update-code', {}, JSON.stringify(newCode));
    };

    return () => {
        stompClient.disconnect();
    };
  }, []);

  async function callGptApi() {
    const API_BODY = {
      "model": "gpt-4",
      "messages": [{"role": "user", "content": code}],
      "temperature": 0,
      "max_tokens": 1024
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GPT_KEY,
      },
      body: JSON.stringify(API_BODY)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      const content = data.choices[0].message.content;
      setOutput(content);
    });
  }

  useEffect(() => {
    const aceScript = document.createElement('script');
    aceScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js';
    aceScript.type = 'text/javascript';
    aceScript.async = true;
    aceScript.onload = () => {
      ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12');
    };
    document.body.appendChild(aceScript);
  
    return () => {
      document.body.removeChild(aceScript);
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRunClick = async () => {
    // Prepare the payload for Judge0 API
    const payload = {
      language_id: getLanguageId(selectedLanguage),
      source_code: code,
      stdin: input, 
    };

    try {
      // Make a POST request to Judge0 API to submit the code
      const submissionResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': '80bdee495emshba92524851b5f8dp199da9jsn8d472064a854', // Replace with your RapidAPI key
        },
      });
      let token = submissionResponse.data.token;
      console.log(token);
      let output = '';
      let status = '';
      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };
      while (
        jsonGetSolution.status.description !== "Accepted" &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
      ) {
        if (token) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "80bdee495emshba92524851b5f8dp199da9jsn8d472064a854",
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
        }
      }
      if (jsonGetSolution.stdout) {
        const output = atob(jsonGetSolution.stdout);
        setOutput(output);
      } else if (jsonGetSolution.stderr) {
        const error = atob(jsonGetSolution.stderr);
        setOutput(error);
      } else {
        const compilation_error = atob(jsonGetSolution.compile_output);
        setOutput(compilation_error);
      }
    } catch (error) {
      setOutput(error.message);
    }
  };

  const getLanguageId = (language) => {
    const languageMap = {
      javascript: 63,
      c_cpp: 50,
      java: 62,
      python: 71,
    };

    return languageMap[language] || 63;
  };
  
  return (
    <div className="CodeEditor">
      <div className="editor-container">
        <div className="left-panel">
          {/* Left panel content goes here */}
          <div className="logo-container">
            <img src="/codelogo.png" alt="Logo" className="logo" />
            <span className="editor-name">CodeSync</span>
          </div>
        </div>
        <div className="right-panel">
          <div className="upper-right">
          <div className="language-selector" style={{  color: 'white' }}>
            <label>Select Language:</label>
              <select
                 value={selectedLanguage}
                 onChange={(e) => handleLanguageChange(e.target.value)}
                 style={{ backgroundColor: '#270227', color: 'white' }}
              >
              <option value="javascript">JavaScript</option>
              <option value="c_cpp">C/C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              </select>
          </div>

              <AceEditor
              className="code-input"
              mode={selectedLanguage}
              theme="monokai"
              onChange={handleCodeChange}
              value={code}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              placeholder="Enter your code here..."
              width="100%"
              height="400px"
              setOptions={{
                showPrintMargin: false, // This removes the print margin line
                fontSize: 18,
              }}
            />
          </div>
          <div className="lower-right">
            {/* Lower right panel content goes here */}
            <div className="options">
            <textarea
              className="input"
              placeholder="Enter your input here..."
              value={input}
              onChange={handleInputChange}
            ></textarea>
            <textarea className="output" placeholder="Output will be displayed here..." value={output} disabled></textarea>
            </div>
            <button className="run-button" onClick = {handleRunClick}>Execute</button>
            <button className="askAI-button" onClick = {callGptApi}>Ask AI</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;