import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS'
const ADD_EVENT = 'ADD_EVENT'

/**
 * ACTION CREATORS
 */
const _getEvents = events => ({type: GET_EVENTS, events})
const _addEvent = event => ({type: ADD_EVENT, event})

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
export const addEvent = (event) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: added } = await axios.post(`/api/events`, event, {
     headers: {
       authorization: token
     }
   });
    dispatch(_addEvent(added));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.events 
    case ADD_EVENT:
      return [...state, action.event]
    default:
      return state
  }
}
