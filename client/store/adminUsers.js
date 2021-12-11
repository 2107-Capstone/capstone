import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_ADMINUSERS = 'GET_ADMINUSERS'

/**
 * ACTION CREATORS
 */
const _getAdminUsers = adminUsers => ({type: GET_ADMINUSERS, adminUsers})

/**
 * THUNK CREATORS
 */
export const getAdminUsers = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: adminUsers } = await axios.get(`/api/admin/adminusers`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getAdminUsers(adminUsers));
  };
}
/**
 * REDUCER
 */
 export default function(state = [], action) {
  switch (action.type) {
    case GET_ADMINUSERS:
      return action.adminUsers
    default:
      return state
  }
}
