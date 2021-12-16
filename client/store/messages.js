import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////////////////// ACTION TYPES ////////////////////////
const GET_MESSAGES = 'GET_MESSAGES'
const CREATE_MESSAGE = 'CREATE_MESSAGE'

//////////////////////// ACTION CREATORS ////////////////////////
const _getMessages = messages => ({ type: GET_MESSAGES, messages })
const _createMessage = message => ({ type: CREATE_MESSAGE, message })

//////////////////////// THUNK CREATORS ////////////////////////
export const getMessages = () => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: messages } = await axios.get(`/api/messages`, {
      headers: {
        authorization: token
      }
    });
    window.socket.send(JSON.stringify(_getMessages(messages)))
    dispatch(_getMessages(messages));
  };
}
export const createMessage = (_message) => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: message } = await axios.post(`/api/messages`, _message, {
      headers: {
        authorization: token
      }
    });
    window.socket.send(JSON.stringify(_createMessage(message)))
    dispatch(_createMessage(message));
  };
}

//////////////////////// REDUCER ////////////////////////
export default function (state = [], action) {
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages
    case CREATE_MESSAGE:
      return [...state, action.message]
    default:
      return state
  }
}
