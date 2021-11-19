import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_FRIENDS = 'GET_FRIENDS'
const CREATE_USERFRIEND = 'CREATE_USERFRIEND' 

/**
 * ACTION CREATORS
 */
const _getFriends = friends => ({type: GET_FRIENDS, friends})
const _createUserFriend = userFriend => ({type: CREATE_USERFRIEND, userFriend})

/**
 * THUNK CREATORS
 */
export const getFriends = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: friends } = await axios.get(`/api/friends`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getFriends(friends));
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
    case GET_FRIENDS:
      return action.friends
    case CREATE_USERFRIEND:
      return [...state, action.userFriend]  
    default:
      return state
  }
}
