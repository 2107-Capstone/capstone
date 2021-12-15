import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_FRIENDS = 'GET_FRIENDS'

/**
 * ACTION CREATORS
 */
const _getFriends = friends => ({type: GET_FRIENDS, friends})

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

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_FRIENDS:
      return action.friends
    default:
      return state
  }
}
