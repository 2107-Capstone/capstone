import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS'

/**
 * ACTION CREATORS
 */
const _getEvents = events => ({type: GET_EVENTS, events})

/**
 * THUNK CREATORS
 */
export const getEvents = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: events } = await axios.get(`/api/events`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getEvents(events));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.events
    default:
      return state
  }
}
