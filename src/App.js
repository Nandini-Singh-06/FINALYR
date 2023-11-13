import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import CodeEditor from './components/CodeEditor';
import LoginPage from './components/LoginPage';

const App = () => {
  return (
<Router>
    <Routes>
      <Route exact path='/' element={<LoginPage/>} />
      <Route exact path='/codeeditor' element={<CodeEditor/>}/>
    </Routes>
</Router>
  );
}

export default App;
