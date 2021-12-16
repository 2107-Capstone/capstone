import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_ADMINTRIPS = 'GET_ADMINTRIPS'

//////////// ACTION CREATORS ////////////
const _getAdminTrips = adminTrips => ({ type: GET_ADMINTRIPS, adminTrips })

//////////////////// THUNK CREATORS  //////////////
export const getAdminTrips = () => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: adminTrips } = await axios.get(`/api/admin/admintrips`, {
      headers: {
        authorization: token
      }
    });
    dispatch(_getAdminTrips(adminTrips));
  };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
  switch (action.type) {
    case GET_ADMINTRIPS:
      return action.adminTrips
    default:
      return state
  }
}
