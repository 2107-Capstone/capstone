import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_USERS = 'GET_USERS'
const UPDATE_USER = 'UPDATE_USER'

/**
 * ACTION CREATORS
 */
const _getUsers = users => ({type: GET_USERS, users})
const _updateUser = user => ({type: UPDATE_USER, user})

/**
 * THUNK CREATORS
 */
export const getUsers = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: users } = await axios.get(`/api/users`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getUsers(users));
  };
}
export const updateUser = (user, type) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: updated } = await axios.put(`/api/users/${user.id}`, user, {
     headers: {
       authorization: token
     }
   });
  //  window.socket.send(JSON.stringify(_updateUser(updated)))
    dispatch(_updateUser(updated));
    if (type !== 'geolocation') {
      setTimeout(() => history.push('/settings'), 2000)
    }
    
  };
}
/**
 * REDUCER
 */
 export default function(state = [], action) {
  switch (action.type) {
    case GET_USERS:
      return action.users
    case UPDATE_USER:
      return state.map(user => user.id === action.user.id ? action.user : user)
    default:
      return state
  }
}
