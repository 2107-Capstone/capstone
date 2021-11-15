import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_EXPENSES = 'GET_EXPENSES'

/**
 * ACTION CREATORS
 */
const _getExpenses = expenses => ({type: GET_EXPENSES, expenses})

/**
 * THUNK CREATORS
 */
export const getExpenses = () => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: expenses } = await axios.get(`/api/expenses`, {
     headers: {
       authorization: token
     }
   });
    dispatch(_getExpenses(expenses));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_EXPENSES:
      return action.expenses
    default:
      return state
  }
}
