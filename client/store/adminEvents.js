import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////////////////// ACTION TYPES ////////////////////////
const GET_ADMINEVENTS = 'GET_ADMINEVENTS'

//////////////////////// ACTION CREATORS ////////////////////////
const _getAdminEvents = adminEvents => ({ type: GET_ADMINEVENTS, adminEvents })

//////////////////////// THUNK CREATORS ////////////////////////
export const getAdminEvents = () => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: adminEvents } = await axios.get(`/api/admin/adminevents`, {
      headers: {
        authorization: token
      }
    });
    dispatch(_getAdminEvents(adminEvents));
  };
}

//////////////////////// REDUCER ////////////////////////
export default function (state = [], action) {
  switch (action.type) {
    case GET_ADMINEVENTS:
      return action.adminEvents
    default:
      return state
  }
}
