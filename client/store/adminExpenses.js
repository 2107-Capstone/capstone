import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_ADMINEXPENSES = 'GET_ADMINEXPENSES'

/**
 * ACTION CREATORS
 */
const _getAdminExpenses = adminExpenses => ({type: GET_ADMINEXPENSES, adminExpenses})

/**
 * THUNK CREATORS
 */
export const getAdminExpenses = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: adminExpenses } = await axios.get(`/api/admin/adminexpenses`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getAdminExpenses(adminExpenses));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_ADMINEXPENSES:
      return action.adminExpenses
    default:
      return state
  }
}
