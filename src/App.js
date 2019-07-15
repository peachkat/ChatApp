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
    if(name){
      this.setState({name})
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
          this.receive(change.doc.data())
        }
      })
    })
    /* <=========================> */
  }

  /* <===========================> */
  receive = (m) => {
    const messages = [m, ...this.state.messages]
    messages.sort((a, b) => b.ts - a.ts)
    this.setState({messages})
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
    this.setState({editName})
  }

  takePicture = async (img) => {
    this.setState({showCamera:false})
    const imgID = Math.random().toString(36).substring(7);
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(imgID+'.jpg');
    await ref.putString(img, 'data_url')
    this.send({img: imgID})
  }

  render() {
    var {editName, messages, name, showCamera} = this.state
    return (
      <Div100vh className="App">
        {showCamera && <Camera takePicture={this.takePicture} />}
        <header className="header">
          <div>
            <img src={coolpic} className="logo" alt="logo" />
            {editName ? '': 'ChatApp'}
          </div>
          <NamePicker
            name={name}
            editName={editName}
            changeName={name => this.setState({name})}
            setEditName={this.setEditName}
          />
        </header>
        <main className="messages">
          {messages.map((m,i)=>{
            return <Message key={i} m={m} name={name} />
          })}
        </main>
        <TextInput sendMessage={text=> this.send({text})} 
          showCamera={()=>this.setState({showCamera:true})}
          />
      </Div100vh>
    )
  }
}

export default App;

const bucket = 'first-project-1a6d0.appspot.com'
const suffix = '.jpg?alt=media'
function Message(props) {
  var{m, name} = props
  return (<div className="bubble-wrap"
    from={m.from===name ? "me" : "you"}
  >
    {m.from!==name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span>{m.text}</span>
      {m.img && <img alt="pic" src={bucket+m.img+suffix} />}
    </div>
  </div>)
}
