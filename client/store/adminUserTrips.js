import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_ADMINUSERTRIPS = 'GET_ADMINUSERTRIPS'

//////////// ACTION CREATORS ////////////
const _getAdminUserTrips = adminUserTrips => ({ type: GET_ADMINUSERTRIPS, adminUserTrips })

//////////////////// THUNK CREATORS  //////////////
export const getAdminUserTrips = () => {
    const token = window.localStorage.getItem(TOKEN)
    
    return async (dispatch) => {
        const { data: adminUserTrips } = await axios.get(`/api/admin/adminusertrips`, {
            headers: {
                authorization: token
            }
        });
        dispatch(_getAdminUserTrips(adminUserTrips));
    };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
    switch (action.type) {
        case GET_ADMINUSERTRIPS:
            return action.adminUserTrips
        default:
            return state
    }
}