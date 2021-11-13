import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_USERS = 'GET_USERS'

/**
 * ACTION CREATORS
 */
const _getUsers = users => ({type: GET_USERS, users})

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

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_USERS:
      return action.users
    default:
      return state
  }
}
