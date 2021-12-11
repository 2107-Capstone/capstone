import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_TRIPDEBTS = 'GET_TRIPDEBTS'

//////////// ACTION CREATORS ////////////
const _getTripDebts = tripDebts => ({ type: GET_TRIPDEBTS, tripDebts })

//////////////////// THUNK CREATORS  //////////////

export const getTripDebts = (tripId) => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: tripDebts } = await axios.get(`/api/userDebts/${tripId}`, {
            headers: {
                authorization: token
            }
        });
        dispatch(_getTripDebts(tripDebts));
    };
}


///////////// REDUCER ////////////////
export default function (state = [], action) {
    switch (action.type) {
        case GET_TRIPDEBTS:
            return action.tripDebts
        default:
            return state
    }
}