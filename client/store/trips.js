import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_TRIPS = 'GET_TRIPS'

/**
 * ACTION CREATORS
 */
const _getTrips = trips => ({type: GET_TRIPS, trips})

/**
 * THUNK CREATORS
 */
export const getTrips = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: trips } = await axios.get(`/api/trips`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getTrips(trips));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_TRIPS:
      return action.trips
    default:
      return state
  }
}
