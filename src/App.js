import React from 'react'
import './App.css'
import coolpic from './staycool.png'
import TextInput from './TextInput'
import NamePicker from './NamePicker.js'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import Camera from 'react-snap-pic'
import Div100vh from 'react-div-100vh'

class App extends React.Component {
  state = {
    messages: [],
    name: '',
    editName: false,
    showCamera: false
  }

  componentWillMount() {
    var name = localStorage.getItem('name')
    if (name) {
      this.setState({ name })
    }
    /* <=========================> */
    firebase.initializeApp({
      apiKey: "AIzaSyCrPKv0IqxIIFxQU0WQPEECD7JZ8hzvLFk",
      authDomain: "first-project-1a6d0.firebaseapp.com",
      projectId: "first-project-1a6d0",
      storageBucket: "first-project-1a6d0.appspot.com",
    });

    this.db = firebase.firestore();

    this.db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //console.log(change.doc.data())
          this.receive({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
        if (change.type === 'removed') {
          this.remove(change.doc.id)
        }
      })
    })
    /* <=========================> */
  } //end componentWillMount

  remove = (id) => {
    var msgs = [...this.state.messages]
    var messages = msgs.filter(m=> m.id!==id)
    this.setState({messages})
  }
  /* <===========================> */
  receive = (m) => {
    const messages = [m, ...this.state.messages]
    messages.sort((a, b) => b.ts - a.ts)
    this.setState({ messages })
  }

  send = (m) => {
    this.db.collection("messages").add({
      ...m,
      from: this.state.name || 'No name',
      ts: Date.now()
    })
  }
  /* <===========================> */

  setEditName = (editName) => {
    if (!editName) {
      localStorage.setItem('name', this.state.name)
    }
    this.setState({ editName })
  }

  takePicture = async (img) => {
    this.setState({ showCamera: false })
    const imgID = Math.random().toString(36).substring(7);
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(imgID + '.jpg');
    await ref.putString(img, 'data_url')
    this.send({ img: imgID })
  }

  render() {
    var { editName, messages, name, showCamera } = this.state
    return (
      <Div100vh className="App">
        {showCamera && <Camera takePicture={this.takePicture} />}
        <header className="header">
          <div>
            <img src={coolpic} className="logo" alt="logo" />
            {editName ? '' : 'ChatApp'}
          </div>
          <NamePicker
            name={name}
            editName={editName}
            changeName={name => this.setState({ name })}
            setEditName={this.setEditName}
          />
        </header>
        <main className="messages">
          {messages.map((m, i) => {
            return <Message key={i} m={m} name={name}
              onClick={() => {
                if(name==='Mimi') { //can also put if (name===m.from) to make only people who sent a message able to delete it
                this.db.collection('messages').doc(m.id).delete()}
                } //Now only 'Mimi' can delete messages >:3
              }
            />
          })}
        </main>
        <TextInput sendMessage={text => this.send({ text })}
          showCamera={() => this.setState({ showCamera: true })}
        />
      </Div100vh>
    )
  } //end render()
} //end App component

export default App;

const bucket = 'https://firebasestorage.googleapis.com/v0/b/first-project-1a6d0.appspot.com/o/'
const suffix = '.jpg?alt=media'
function Message(props) {
  var { m, name, onClick } = props
  return (<div className="bubble-wrap"
    from={m.from === name ? "me" : "you"}
    onClick={onClick}
  >
    {m.from !== name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span>{m.text}</span>
      {m.img && <img alt="pic" src={bucket + m.img + suffix} />}
    </div>
  </div>)
}
