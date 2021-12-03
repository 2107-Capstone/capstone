import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_TRIPS = 'GET_TRIPS'
const ADD_TRIP = 'ADD_TRIP'
const CLOSE_TRIP = 'CLOSE_TRIP'

//////////// ACTION CREATORS ////////////
const _getTrips = trips => ({ type: GET_TRIPS, trips })

const _addTrip = trip => ({ type: ADD_TRIP, trip })
const _closeTrip = trip => ({ type: CLOSE_TRIP, trip })

//////////////////// THUNK CREATORS  //////////////
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
export const addTrip = (tripToAdd) => {
  const token = window.localStorage.getItem(TOKEN)
  // console.log(tripToAdd)

  return async (dispatch) => {
    const { data: trip } = await axios.post(`/api/trips`, tripToAdd, {
      headers: {
        authorization: token
      }
    });
    // console.log(trip)
    dispatch(_addTrip(trip));
    history.push('/trips')
  };
}

export const closeTrip = (trip) => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: closed } = await axios.put(`/api/trips/${trip.tripId}`, {
      headers: {
        authorization: token
      }
    });
    // console.log(trip)
    dispatch(_closeTrip(closed));
    history.push('/trips')
  };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
  switch (action.type) {
    case GET_TRIPS:
      return action.trips
    case ADD_TRIP:
      return [action.trip, ...state]
    case CLOSE_TRIP:
      return state.map(trip => trip.tripId === action.id ? action.trip : trip)
    default:
      return state
  }
}
