import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_TRIPS = 'GET_TRIPS'
const ADD_TRIP = 'ADD_TRIP'
const CLOSE_TRIP = 'CLOSE_TRIP'
const LEAVE_TRIP = 'LEAVE_TRIP'

//////////// ACTION CREATORS ////////////
const _getTrips = trips => ({ type: GET_TRIPS, trips })

const _addTrip = trip => ({ type: ADD_TRIP, trip })
const _closeTrip = trip => ({ type: CLOSE_TRIP, trip })
const _leaveTrip = trip => ({ type: LEAVE_TRIP, trip })

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
    console.log(trip)

    const { data: closed } = await axios.put(`/api/trips/${trip.id}`, {
      headers: {
        authorization: token
      }
    });
    // console.log(trip)
    dispatch(_closeTrip(closed));
    // history.push('/trips')
  };
}

export const leaveTrip = (usertripId) => {
  const token = window.localStorage.getItem(TOKEN)

  // console.log(usertripId)
  return async (dispatch) => {

    const { data: leavetrip } = await axios.delete(`/api/trips/${usertripId}`, {
      headers: {
        authorization: token
      }
    });
    // console.log(leavetrip)
    dispatch(_leaveTrip(leavetrip));
    // history.push('/trips')
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
    case LEAVE_TRIP:
      return state.filter(trip => trip.id !== action.trip.id)
    default:
      return state
  }
}
