import React from 'react';
import './App.css';
import coolpic from './staycool.png';
import TextInput from './TextInput';
import { FiMessageSquare } from 'react-icons/fi';
class App extends React.Component {

  state={
    messages:[]
  }

  gotMessage=(m)=>{
    var messages = [...this.state.messages, m]
    this.setState({messages})
  }

  render() {
    var { messages } = this.state
    return (
      <div className="App">
        <header className="header">
          <img src={coolpic} className="logo" alt="logo" />
          <b>ChatApp</b>
        </header>
        <main className="messages">
          {messages.map((m, i) => {
            return <div key={i}>{m}</div>
          })}
        </main>
        <TextInput sendMessage={this.gotMessage} />
      </div>
    )
  }
}

export default App
