import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const GET_EXPENSES = 'GET_EXPENSES'
const ADD_EXPENSE = 'ADD_EXPENSE'

/**
 * ACTION CREATORS
 */
const _getExpenses = expenses => ({type: GET_EXPENSES, expenses})
const _addExpense = expense => ({type: ADD_EXPENSE, expense})

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

export const addExpense = (expense) => {
  const token = window.localStorage.getItem(TOKEN)
  
  return async (dispatch) => {
    const { data: added } = await axios.post(`/api/expenses`, expense, {
     headers: {
       authorization: token
     }
   });
    dispatch(_addExpense(added));
  };
}

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case GET_EXPENSES:
      return action.expenses
    case ADD_EXPENSE:
      return [...state, action.expense]
    default:
      return state
  }
}
