import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, formatISO, parseISO, isAfter } from "date-fns";
import { Link } from "react-router-dom";

import { createMessage } from "../../store";
import {TripTitle, UserAvatar} from '../Trip/TripComponents';
// import { Participants } from "../Trip/tripInfo";
import useChat from "./useChat";
import CircularLoading from '../Loading/CircularLoading'
import CardTravelIcon from '@mui/icons-material/CardTravel';
import { Avatar, Box, Grid, Button, TextField, Tooltip, Typography, Dialog } from '@mui/material'
// const ChatRoom = (props) => {
//   const { id } = props.match.params;
// const ChatRoom = ({trip, match}) => {
import theme from '../../theme'
import userDebts from "../../store/userDebts";
const ChatRoom = ({match}) => {
  
  // const id = trip ? trip.tripId : match.params.id;
  const id = match.params.id;
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const trip = useSelector(state => state.trips.find(trip => trip.tripId === id))

  const { messages, sendMessage } = useChat(id);
  
  const [newMessage, setNewMessage] = useState("");

  const [timeOpened, setTimeOpened] = useState(formatISO(Date.now()));

  useEffect(() => {
    setTimeOpened((formatISO(Date.now())));
  }, [auth.id])

  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(scrollToBottom, [messages])

  let storeMessages = useSelector(state => state.messages.filter(message => message.tripId === id).sort((a, b) => a.dateSent < b.dateSent ? -1 : 1));
  storeMessages.forEach(message => message.ownedByCurrentUser = (message.sentById === auth.id));

  const DisplayStoreMessages = () => {
    
    return storeMessages.filter(message => isAfter(parseISO(timeOpened), parseISO(message.dateSent))).map((message) => (
      <li
        key={message.id + Math.random().toString(16)}
        style={message.ownedByCurrentUser ? styles.messageItemMyMessageOld : styles.messageItemReceivedMessageOld}
      >
        <Box display='flex' flexDirection='column'>
            <Typography variant='caption'>
              {format(parseISO(message.dateSent), 'Pp')}
            </Typography>
          <Box display='flex' alignItems='center'>
            <UserAvatar user={message.sentBy} />
            {/* <Box display='flex' flexDirection='column' alignItems='center'>
              <Avatar sx={{ height: 35, width: 35, m: 1, mb: 0}} src={message.sentBy.avatar} >
                  {message.sentBy.firstName[0]+message.sentBy.lastName[0]}
              </Avatar>
              <Typography variant='caption'>
                {message.sentBy.username}
              </Typography> 
            </Box> */}
            <Typography marginLeft={1}>
              {message.content}
            </Typography> 
          </Box>
        </Box>
      </li>
    ))
  }

  const DisplayNewMessages = () => {
    return messages.map((message) => (
      <li
        key={message.id + Math.random().toString(16)}
        style={message.ownedByCurrentUser ? styles.messageItemMyMessage : styles.messageItemReceivedMessage}
      >
        <Box display='flex' flexDirection='column'>
            <Typography variant='caption'>
              ({format(Date.now(), 'Pp')})
            </Typography>
          <Box display='flex' alignItems='center'>
            <UserAvatar user={message} />
            <Typography>
              {message.content}
            </Typography> 
          </Box>
        </Box>
        {/* ({format(Date.now(), 'Pp')}) {message.senderName}:   {message.content} */}
      </li>
    ))
  }

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    sendMessage(newMessage);
    await dispatch(createMessage({ content: newMessage, sentById: auth.id, tripId: id, dateSent: Date.now() }))
    setNewMessage("");
  };

  if (!trip) return <CircularLoading />
  const unpaidDebts = trip.trip.userDebts.filter(debt => debt.status === 'pending');

  return (
    <>
    <TripTitle trip={trip} />
    <div style={styles.chatRoomContainer}>
      {
        !trip ? <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <CardTravelIcon fontSize='medium' />
                    <Box sx={{ color: 'inherit' }} component={Link} to={`/trips/${id}`}>
                        <Typography variant='h5'>
                            &nbsp;{trip.trip.name}
                        </Typography>
                    </Box>
                </Box>
        : ''
      }
      <div style={styles.messagesContainer} >
        <ol key={Math.random().toString(16)} style={styles.messagesList}>
          <DisplayStoreMessages />
          <DisplayNewMessages />
          <div ref={messagesEndRef} />
        </ol>
      </div>
      {
        trip.trip.isOpen || unpaidDebts.length > 0 ?
          <>
            <textarea
              value={newMessage}
              onChange={handleNewMessageChange}
              placeholder="Write message..."
              style={styles.newMessageInputField}
            />
            <Button onClick={handleSendMessage} 
              style={styles.sendMessageButton}
            >
              Send
            </Button>
          </>
        : ''
      }
    </div>
    </>
  );
};

export default ChatRoom;

const styles = {
  chatRoomContainer: {
    // position: 'fixed',
    left: 0,
    right: 0,
    top: 150,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    margin: '16px',
    maxHeight: 800, 
    overflow: 'auto' 
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
    borderColor: theme.palette.primary.main
  },

  messagesList: {
    listStyleType: 'none',
    padding: 0,
  },

  newMessageInputField: {
    height: '100px',
    maxHeight: '50%',
    fontSize: '16px',
    padding: '8px 12px',
    resize: 'none',
    borderColor: theme.palette.primary.main,
    borderRadius: '0 0 7px 7px',
    fontFamily: 'verdana'
  },

  messageItemMyMessage: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    marginLeft: 'auto'
  },
  messageItemMyMessageOld: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    opacity: .85,
    marginLeft: 'auto',
    fontStyle: 'italic'
  },
  messageItemReceivedMessage: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.secondary.main,
    marginRight: 'auto'
  },
  messageItemReceivedMessageOld: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.secondary.main,
    opacity: .85,
    marginRight: 'auto',
    fontStyle: 'italic'
  },
  sendMessageButton: {
    fontSize: 20,
    fontWeight: 200,
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    padding: '10px 5px',
    border: 'none',
    borderColor: '#9a9a9a',
    width: '30%',
    alignSelf: 'center',
    borderRadius: '4px',
    ':disabled': {
      backgroundColor: 'grey'
    }
  },
  
}
// style={{ ':disabled': {backgroundColor: 'grey' } }}