import React from 'react';
import './App.css';
import coolpic from './staycool.png';
import TextInput from './TextInput';
import { FiMessageSquare } from 'react-icons/fi';
import NamePicker from './NamePicker.js'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'


class App extends React.Component {

  state={
    messages:[],
    name: '',
    editName: false,
  }

  gotMessage=(m)=> {
    const message = {
      text: m,
      from: this.state.name
    } 
    var newMessagesArray = [m, ...this.state.messages]
    this.setState({messages: newMessagesArray})
  }

  setEditName = (editName) => {
    if(!editName){
      localStorage.setItem('name', this.state.name)
    }
    this.setState({editName})
  }

  render() {
    var { editName, messages, name } = this.state
    return (
      <div className="App">
        <header className="header">
          <div>
          <img src={coolpic} className="logo" alt="logo" />
          <b>ChatApp</b>
          </div>
            <NamePicker
            name = {name}
            editName = {editName} 
            changeName={name => this.setState({ name })} 
            setEditName = {this.setEditName}
            />
        </header>
        <main className="messages">
          {messages.map((m, i) => {
            return <div key={i} className="bubble-wrap"> {m}</div>
          
          })}
        </main>
        <TextInput sendMessage={this.gotMessage} />
      </div>
    )
  }
}

export default App
