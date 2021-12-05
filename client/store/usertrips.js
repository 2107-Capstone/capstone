import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_USERTRIPS = 'GET_USERTRIPS'

//////////// ACTION CREATORS ////////////
const _getUserTrips = usertrips => ({ type: GET_USERTRIPS, usertrips })


//////////////////// THUNK CREATORS  //////////////
export const getUserTrips = () => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: usertrips } = await axios.get(`/api/usertrips`, {
            headers: {
                authorization: token
            }
        });
        console.log(usertrips)
        dispatch(_getUserTrips(usertrips));
    };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
    switch (action.type) {
        case GET_USERTRIPS:
            return action.usertrips
        //   case ADD_TRIP:
        // return [action.trip, ...state]
        //   case CLOSE_TRIP:
        // return state.map(trip => trip.tripId === action.id ? action.trip : trip)
        default:
            return state
    }
}