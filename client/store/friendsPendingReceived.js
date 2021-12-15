import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_FRIENDSPENDINGRECEIVED = 'GET_FRIENDSPENDINGRECEIVED'

/**
 * ACTION CREATORS
 */
const _getFriendsPendingReceived = friendsPendingReceived => ({type: GET_FRIENDSPENDINGRECEIVED, friendsPendingReceived})

/**
 * THUNK CREATORS
 */
export const getFriendsPendingReceived = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: friendsPendingReceived } = await axios.get(`/api/friendsPendingReceived`, {
     headers: {
       authorization: token
     }
   });
   window.socket.send(JSON.stringify(_getFriendsPendingReceived(friendsPendingReceived)))
    dispatch(_getFriendsPendingReceived(friendsPendingReceived));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_FRIENDSPENDINGRECEIVED:
      return action.friendsPendingReceived
    default:
      return state
  }
}
