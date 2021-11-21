import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_FRIENDSPENDING = 'GET_FRIENDSPENDING'

/**
 * ACTION CREATORS
 */
const _getFriendsPending = friendsPending => ({type: GET_FRIENDSPENDING, friendsPending})

/**
 * THUNK CREATORS
 */
export const getFriendsPending = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: friendsPending } = await axios.get(`/api/friendsPending`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getFriendsPending(friendsPending));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_FRIENDSPENDING:
      return action.friendsPending
    default:
      return state
  }
}
