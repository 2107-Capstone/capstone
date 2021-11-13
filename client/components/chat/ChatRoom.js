import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, formatISO, parseISO, isAfter } from "date-fns";

import useChat from "./useChat";
import { createMessage } from "../../store";

const ChatRoom = (props) => {
    const { roomId } = props.match.params;
    
    const dispatch = useDispatch();
    
    const auth = useSelector(state => state.auth);
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === +roomId))
    
    const { messages, sendMessage } = useChat(roomId);
    const [newMessage, setNewMessage] = useState("");
    
    const [timeOpened, setTimeOpened] = useState(formatISO(Date.now()));
    
    useEffect(() => {  
      setTimeOpened((formatISO(Date.now())));
    }, [auth.id])
    
    const messagesEndRef = useRef();
    
    const scrollToBottom = () => {
      if(!messagesEndRef.current) return;
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(scrollToBottom, [messages])
    
    let storeMessages = useSelector(state => state.messages.filter(message => message.tripId === +roomId).sort((a,b) => a.dateSent < b.dateSent ? -1 : 1));
    storeMessages.forEach(message => message.ownedByCurrentUser = (message.sentById === auth.id));

    const DisplayStoreMessages = () => {
      return storeMessages.filter(message => isAfter(parseISO(timeOpened), parseISO(message.dateSent)) ).map((message) => (
        <li
          key={message.id + Math.random().toString(16)}
          style={message.ownedByCurrentUser ? styles.messageItemMyMessageOld : styles.messageItemReceivedMessageOld}
        >
          ({format(parseISO(message.dateSent), 'Pp')}) {message.sentBy.username}:   {message.content}
        </li>
      ))
    }

    const DisplayNewMessages = () => {
      return messages.map((message) => (
        <li
          key={message.id + Math.random().toString(16)}
          style={message.ownedByCurrentUser ? styles.messageItemMyMessage : styles.messageItemReceivedMessage}
        >
          ({format(Date.now(), 'Pp')}) {message.senderName}:   {message.content}
        </li>
      ))
    }
    
    const participants = useSelector(state => state.users.reduce((accum, user) => {
      !!user.userTrips.find(trip => trip.tripId === +roomId) ? accum.push(user) : '';
      return accum;
    }, []))
      
    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = async() => {
    sendMessage(newMessage);
    await dispatch(createMessage({content: newMessage, sentById: auth.id, tripId: roomId, dateSent: Date.now() }))
    setNewMessage("");
    };

  if(storeMessages.length === 0 || !trip) return '...loading'

  return (
    <div style={styles.chatRoomContainer}>
      <h1 style={styles.roomName}>Chat: {trip.trip.name}</h1>
      Trip Friends
      <ul>
        {
          participants.map(person => (
            <li key={person.id} style={person.username === auth.username ? styles.currentUser : null}>{person.username}</li>
          ))
        }
      </ul>
      <div style={styles.messagesContainer} >
        <ol key={Math.random().toString(16)} style={styles.messagesList}>
          <DisplayStoreMessages />
          <DisplayNewMessages />
          <div ref={messagesEndRef} />
        </ol>
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        style={styles.newMessageInputField}
      />
      <button onClick={handleSendMessage} style={styles.sendMessageButton}>
        Send
      </button>
    </div>
  );
};

export default ChatRoom;

const styles = {
  chatRoomContainer: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 150,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    margin: '16px'
},
roomName: {
  marginTop: 0,
},
currentUser: {
  fontWeight: 'bold',
},
messagesContainer: {
  flex: 1,
  minHeight: '100px',
  overflow: 'auto',
  border: '1px solid black',
  borderRadius: '7px 7px 0 0',
  borderColor: '#9a9a9a'
},

messagesList: {
  listStyleType: 'none',
  padding: 0,
},

newMessageInputField: {
  height: '200px',
  maxHeight: '50%',
  fontSize: '20px',
  padding: '8px 12px',
  resize: 'none',
  borderColor: '#9a9a9a',
    fontFamily: 'verdana'
},

messageItemMyMessage: {
  width: '55%',
  margin: '8px',
  padding: '12px 8px',
  wordBreak: 'break-word',
  borderRadius: '4px',
  color: 'black',
  backgroundColor: '#F7C409',
  marginLeft: 'auto'
},
messageItemMyMessageOld: {
  width: '55%',
  margin: '8px',
  padding: '12px 8px',
  wordBreak: 'break-word',
  borderRadius: '4px',
  color: 'white',
  backgroundColor: '#F7C409',
  marginLeft: 'auto',
  fontStyle: 'italic'
},
messageItemReceivedMessage: {
  width: '55%',
  margin: '8px',
  padding: '12px 8px',
  wordBreak: 'break-word',
  borderRadius: '4px',
  color: 'black',
  backgroundColor: '#3BBB67',
  marginRight: 'auto'
},
messageItemReceivedMessageOld: {
  width: '55%',
  margin: '8px',
  padding: '12px 8px',
  wordBreak: 'break-word',
  borderRadius: '4px',
  color: 'white',
  backgroundColor: '#3BBB67',
  marginRight: 'auto',
  fontStyle: 'italic'
},
sendMessageButton: {
  fontSize: 20,
  fontWeight: 200,
  color: 'white',
  background: 'dodgerBlue',
  padding: '10px 5px',
  border: 'none',
  borderColor: '#9a9a9a',
  width: '30%',
  alignSelf: 'center',
  borderRadius: '4px',
},

}