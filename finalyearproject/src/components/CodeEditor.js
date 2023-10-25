import React, { useState } from 'react';
import './CodeEditor.css';

const CodeEditor = () => {
  const [code, setCode] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="CodeEditor">
      <div className="editor-container">
        <div className="left-panel">
          {/* Left panel content goes here */}
          <div className="logo-container">
            <img src="/codelogo.png" alt="Logo" className="logo" />
            <span className="editor-name">CodeEditor</span>
          </div>
        </div>
        <div className="right-panel">
          <div className="upper-right">
            <textarea
              className="code-input"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter your code here..."
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
}

export default CodeEditor;