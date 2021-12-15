import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_USERFRIENDS = 'GET_USERFRIENDS'
const CREATE_USERFRIEND = 'CREATE_USERFRIEND'
const DELETE_USERFRIEND = 'DELETE_USERFRIEND'
const APPROVE_USERFRIEND = 'APPROVE_USERFRIEND'

/**
 * ACTION CREATORS
 */
const _getUserFriends = userFriends => ({ type: GET_USERFRIENDS, userFriends })
const _createUserFriend = userFriend => ({ type: CREATE_USERFRIEND, userFriend })
const _deleteUserFriend = id => ({ type: DELETE_USERFRIEND, id })
const _approveUserFriend = userFriend => ({ type: APPROVE_USERFRIEND, userFriend })


/**
 * THUNK CREATORS
 */
export const getUserFriends = () => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: userFriends } = await axios.get(`/api/userFriends`, {
      headers: {
        authorization: token
      }
    });
    dispatch(_getUserFriends(userFriends));
  };
}

export const createUserFriend = (userFriend) => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: created } = await axios.post('/api/userFriends', userFriend, {
      headers: {
        authorization: token
      }
    })
    // window.socket.send(JSON.stringify(_createUserFriend(created)))
    dispatch(_createUserFriend(created))
  }
}

export const deleteUserFriend = (id) => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    await axios.delete(`/api/userFriends/${id}`, {
      headers: {
        authorization: token
      }
    })
    // window.socket.send(JSON.stringify(_deleteUserFriend(id)))
    dispatch(_deleteUserFriend(id))
  }
}

export const approveUserFriend = (userFriend) => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: approved } = await axios.put(`/api/userFriends/${userFriend.id}`, userFriend, {
      headers: {
        authorization: token
      }
    })
    // window.socket.send(JSON.stringify(_approveUserFriend(approved)))
    dispatch(_approveUserFriend(approved))
  }
}

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_USERFRIENDS:
      return action.userFriends
    case CREATE_USERFRIEND:
      return [...state, action.userFriend]
    case APPROVE_USERFRIEND:
      return state.map(userFriend => userFriend.id === action.userFriend.id ? action.userFriend : userFriend)
    case DELETE_USERFRIEND:
      return state.filter(userFriend => userFriend.id !== action.id)
    default:
      return state
  }
}
