import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////////////////// ACTION TYPES ////////////////////////
const GET_ADMINMESSAGES = 'GET_ADMINMESSAGES'

//////////////////////// ACTION CREATORS ////////////////////////
const _getAdminMessages = adminMessages => ({ type: GET_ADMINMESSAGES, adminMessages })

//////////////////////// THUNK CREATORS ////////////////////////
export const getAdminMessages = () => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: adminMessages } = await axios.get(`/api/admin/adminmessages`, {
      headers: {
        authorization: token
      }
    });
    dispatch(_getAdminMessages(adminMessages));
  };
}

//////////////////////// REDUCER ////////////////////////
export default function (state = [], action) {
  switch (action.type) {
    case GET_ADMINMESSAGES:
      return action.adminMessages
    default:
      return state
  }
}
