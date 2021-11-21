import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_USERFRIENDS = 'GET_USERFRIENDS'
const CREATE_USERFRIEND = 'CREATE_USERFRIEND' 

/**
 * ACTION CREATORS
 */
const _getUserFriends = userFriends => ({type: GET_USERFRIENDS, userFriends})
const _createUserFriend = userFriend => ({type: CREATE_USERFRIEND, userFriend})

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
  const token  = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: created } = await axios.post('/api/userFriends', userFriend, {
      headers: {
        authorization: token
      }
    })
    dispatch(_createUserFriend(created))
  }
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_USERFRIENDS:
        return action.userFriends
    case CREATE_USERFRIEND:
      return [...state, action.userFriend]  
    default:
      return state
  }
}
