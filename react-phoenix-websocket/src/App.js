import React, { useState, useEffect } from 'react';
import './App.css';
import {Socket} from "phoenix"
import {
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from '@material-ui/core';

let socket = new Socket("ws://localhost:4000/socket", {params: {token: window.userToken}})
let channel = socket.channel("room:lobby", {})

const App = () => {
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(chatHistory == null ? [] : chatHistory);

  useEffect(() => {
    socket.connect();

    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })

    channel.on("room:lobby:new_message", (message) => {
      let chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
      console.log("ss", chatHistory);
      if (chatHistory == null) {
        localStorage.setItem('chatHistory', JSON.stringify([message]));
      }
      else {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory.concat([message])));
      }

      updateChat(message);
    })
  }, [])

  const updateChat = (message) => {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    setChat(chatHistory);
  }

  const handleOnSubmit = () => {
    if (message !== '') {
      channel.push('message:add', { message: message });
      setMessage('');
    }
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  }

  const renderChat = () => {
    return (
      <List>
        {chat.map((message, index) => (
          <ListItem key={`message-${index}`} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Simba" src={require('./assets/images/simba-picture.jpg')} />
            </ListItemAvatar>
            <ListItemText
              primary="Simba"
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {message.content}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <div className="App">
      <div>
        <h1>Websocket testing</h1>
      </div>
      <form noValidate autoComplete="off" id="new-message">
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="message-content"
              value={message}
              label="What's on your mind?"
              variant="outlined"
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={5}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOnSubmit}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container justify="center">
        {renderChat()}
      </Grid>
    </div>
  );
}

export default App;
