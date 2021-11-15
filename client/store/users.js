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
export const updateUser = (_user) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: user } = await axios.put(`/api/users/${_user.id}`, _user,{
     headers: {
       authorization: token
     }
   });
    dispatch(_updateUser(user));
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
