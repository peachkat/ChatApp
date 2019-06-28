import React from 'react';
import './App.css';
import coolpic from './staycool.png';
import TextInput from './TextInput';

function App() {
  return (
    <div className="App">
      <header className="header">ChatApp</header>
      <img src={coolpic} className="logo" alt="logo" />
      <TextInput />
    </div>
  );
}

export default App
