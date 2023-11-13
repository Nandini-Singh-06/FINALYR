/* global ace */ // eslint-disable-line no-unused-vars
import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import './CodeEditor.css';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

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

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
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
              <button className="option">Input</button>
              <button className="option">Output</button>
            </div>
            <button className="run-button">Run</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;