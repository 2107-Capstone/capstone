import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_FRIENDSPENDINGSENT = 'GET_FRIENDSPENDINGSENT'

/**
 * ACTION CREATORS
 */
const _getFriendsPendingSent = friendsPendingSent => ({type: GET_FRIENDSPENDINGSENT, friendsPendingSent})

/**
 * THUNK CREATORS
 */
export const getFriendsPendingSent = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: friendsPendingSent } = await axios.get(`/api/friendsPendingSent`, {
     headers: {
       authorization: token
     }
   });
  //  window.socket.send(JSON.stringify(_getFriendsPendingSent(friendsPendingSent)))
    dispatch(_getFriendsPendingSent(friendsPendingSent));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_FRIENDSPENDINGSENT:
      return action.friendsPendingSent
    default:
      return state
  }
}
