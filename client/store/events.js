import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS'
const ADD_EVENT = 'ADD_EVENT'
const EDIT_EVENT = 'EDIT_EVENT'
const DELETE_EVENT = 'DELETE_EVENT'
/**
 * ACTION CREATORS
 */
const _getEvents = events => ({type: GET_EVENTS, events})
const _addEvent = event => ({type: ADD_EVENT, event})
const _editEvent = event => ({ type: EDIT_EVENT, event })
const _deleteEvent = id => ({ type: DELETE_EVENT, id })
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
export const editEvent = (event) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: edited } = await axios.put(`/api/events/${event.id}`, event, {
     headers: {
       authorization: token
     }
   });
    dispatch(_editEvent(edited));
  };
}
export const deleteEvent = (id) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    await axios.delete(`/api/events/${id}`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_deleteEvent(id));
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
    case EDIT_EVENT:
      return state.map(event => event.id === action.event.id ? action.event : event)
    case DELETE_EVENT:
      return state.filter(event => event.id !== action.id)
    default:
      return state
  }
}
