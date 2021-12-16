import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////////////////// ACTION TYPES ////////////////////////
const GET_CATEGORIES = 'GET_CATEGORIES'

//////////////////////// ACTION CREATORS ////////////////////////
const _getCategories = categories => ({ type: GET_CATEGORIES, categories })

//////////////////////// THUNK CREATORS ////////////////////////
export const getCategories = () => {
  const token = window.localStorage.getItem(TOKEN)

  return async (dispatch) => {
    const { data: categories } = await axios.get(`/api/categories`, {
      headers: {
        authorization: token
      }
    });
    dispatch(_getCategories(categories));
  };
}

//////////////////////// REDUCER ////////////////////////
export default function (state = [], action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories
    default:
      return state
  }
}
