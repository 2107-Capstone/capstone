import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_USERTRIPS = 'GET_USERTRIPS'

const INVITEFRIEND = 'INVITEFRIEND'

//////////// ACTION CREATORS ////////////
const _getUserTrips = usertrips => ({ type: GET_USERTRIPS, usertrips })
const _inviteFriend = invited => ({ type: INVITEFRIEND, invited })


//////////////////// THUNK CREATORS  //////////////
export const getUserTrips = () => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: usertrips } = await axios.get(`/api/usertrips`, {
            headers: {
                authorization: token
            }
        });
        // console.log(usertrips)
        dispatch(_getUserTrips(usertrips));
    };
}
export const inviteFriend = (invite) => {
    const token = window.localStorage.getItem(TOKEN)
    console.log(invite)
    return async (dispatch) => {
        const { data: invited } = await axios.post(`/api/usertrips`, { invite }, {
            headers: {
                authorization: token
            }
        });
        // console.log(usertrip)
        dispatch(_inviteFriend(invited));
    };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
    switch (action.type) {
        case GET_USERTRIPS:
            return action.usertrips
        case INVITEFRIEND:
            return [action.invited, ...state]
        //   case CLOSE_TRIP:
        // return state.map(trip => trip.tripId === action.id ? action.trip : trip)
        default:
            return state
    }
}