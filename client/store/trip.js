import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_TRIP = 'GET_TRIP'

/**
 * ACTION CREATORS
 */
const _getTrip = trip => ({type: GET_TRIP, trip})

/**
 * THUNK CREATORS
 */
export const getTrip = (id) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: trip } = await axios.get(`/api/trips/${id}`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getTrip(trip));
  };
}

/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case GET_TRIP:
      return action.trip
    default:
      return state
  }
}
