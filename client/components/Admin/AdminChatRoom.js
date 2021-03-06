import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { format, formatISO, parseISO, isAfter } from "date-fns";
import { Link } from "react-router-dom";

import useChat from "../Chat/useChat";
import CircularLoading from '../Loading/CircularLoading'
import CardTravelIcon from '@mui/icons-material/CardTravel';
import { Avatar, Box, Typography } from '@mui/material'
import theme from '../../theme'
const AdminChatRoom = ({trip, match}) => {
  
  const id = trip ? trip.id : match.params.id;

  // const auth = useSelector(state => state.auth);
  const thisTrip = trip ? trip : useSelector(state => state.adminTrips.find(adminTrip => adminTrip.id === id))

  // const { messages } = useChat(id);
  

  const [timeOpened, setTimeOpened] = useState(formatISO(Date.now()));

  // useEffect(() => {
  //   setTimeOpened((formatISO(Date.now())));
  // }, [auth.id])

  // const messagesEndRef = useRef();

  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  // useEffect(scrollToBottom, [messages])

  let storeMessages = useSelector(state => state.adminMessages.filter(adminMessage => adminMessage.tripId === id).sort((a, b) => a.dateSent < b.dateSent ? -1 : 1));
  // storeMessages.forEach(message => message.ownedByCurrentUser = (message.sentById === auth.id));
// console.log(storeMessages)
  const DisplayStoreMessages = () => {
    
    // return storeMessages.filter(message => isAfter(parseISO(timeOpened), parseISO(message.dateSent))).map((message) => (
    return storeMessages.map((message) => (
      <li
        key={message.id}
        style={styles.messageItemReceivedMessageOld}
      >
        <Box display='flex' flexDirection='column'>
            <Typography variant='caption'>
              {format(parseISO(message.dateSent), 'Pp')}
            </Typography>
          <Box display='flex' alignItems='center'>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <Avatar sx={{ height: 35, width: 35, m: 1, mb: 0}} src={message.sentBy.avatar} >
                  {message.sentBy.firstName[0]+message.sentBy.lastName[0]}
              </Avatar>
              <Typography variant='caption'>
                {message.sentBy.username}
              </Typography> 
            </Box>
            <Typography marginLeft={1}>
              {message.content}
            </Typography> 
          </Box>
        </Box>
      </li>
    ))
  }

  // const DisplayNewMessages = () => {
  //   return messages.map((message) => (
  //     <li
  //       key={message.id + Math.random().toString(16)}
  //       style={message.ownedByCurrentUser ? styles.messageItemMyMessage : styles.messageItemReceivedMessage}
  //     >
  //       <Box display='flex' flexDirection='column'>
  //           <Typography variant='caption'>
  //             ({format(Date.now(), 'Pp')})
  //           </Typography>
  //         <Box display='flex' alignItems='center'>
  //           <Avatar sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} src={message.avatar} >
  //               {message.firstName[0]+message.lastName[0]}
  //           </Avatar>
  //           <Typography>
  //             {message.content}
  //           </Typography> 
  //         </Box>
  //       </Box>
  //     </li>
  //   ))
  // }

  if (!thisTrip) return <CircularLoading />

  return (
    <div style={styles.chatRoomContainer}>
      {
        !trip ? <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <CardTravelIcon fontSize='medium' />
                    <Box sx={{ color: 'inherit' }} component={Link} to={`/admin/admintrips/${id}`}>
                    <Typography variant='h5'>
                        &nbsp;{thisTrip.name}
                        {
                            thisTrip.isOpen ? "" :
                                " (Closed)"
                        }
                    </Typography>
                    </Box>
                </Box>
        : ''
      }
      <div style={styles.messagesContainer} >
        <Box key={Math.random().toString(16)} style={styles.messagesList} sx={{maxHeight: 500, overflow: 'auto'}}>
          <DisplayStoreMessages />
          {/* <DisplayNewMessages /> */}
          {/* <div ref={messagesEndRef} /> */}
        </Box>
      </div>
    </div>
  );
};

export default AdminChatRoom;

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
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    marginLeft: 'auto'
  },
  messageItemMyMessageOld: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    marginLeft: 'auto',
    fontStyle: 'italic'
  },
  messageItemReceivedMessage: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    marginRight: 'auto'
  },
  messageItemReceivedMessageOld: {
    width: '55%',
    margin: '8px',
    padding: '12px 8px',
    wordBreak: 'break-word',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
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