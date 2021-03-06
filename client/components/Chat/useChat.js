import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = window.location.origin;

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const user = useSelector(state => state.auth);
  console.log(socketIOClient)
  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.sentById === user.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      content: messageBody,
      sentById: user.id,
      username: user.username,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName
    });
  };

  return { messages, sendMessage };
};

export default useChat;