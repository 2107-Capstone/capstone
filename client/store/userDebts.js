import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_USERDEBTS = 'GET_USERDEBTS'
const ADD_USERDEBT = 'ADD_USERDEBT'
const EDIT_USERDEBT = 'EDIT_USERDEBT'
//////////// ACTION CREATORS ////////////
const _getUserDebts = userDebts => ({ type: GET_USERDEBTS, userDebts })
const _addUserDebt = userDebt => ({ type: ADD_USERDEBT, userDebt })
const _editUserDebt = userDebt => ({ type: EDIT_USERDEBT, userDebt })
//////////////////// THUNK CREATORS  //////////////
export const getUserDebts = () => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: userDebts } = await axios.get(`/api/userDebts`, {
            headers: {
                authorization: token
            }
        });
        dispatch(_getUserDebts(userDebts));
    };
}

export const addUserDebt = (userDebt) => {
    const token = window.localStorage.getItem(TOKEN)

    return async (dispatch) => {
        const { data: added } = await axios.post(`/api/userDebts`, { userDebt }, {
            headers: {
                authorization: token
            }
        });
        window.socket.send(JSON.stringify(_addUserDebt(added)))
        dispatch(_addUserDebt(added));
    };
}
export const editUserDebt = (userDebt) => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        console.log('store', userDebt)
        const { data: edited } = await axios.put(`/api/userDebts/${userDebt.id}`, { userDebt }, {
            headers: {
                authorization: token
            }
        });
        window.socket.send(JSON.stringify(_editUserDebt(edited)))
        dispatch(_editUserDebt(edited));
    };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
    switch (action.type) {
        case GET_USERDEBTS:
            return action.userDebts
        case ADD_USERDEBT:
            return [action.userDebt, ...state]
        case EDIT_USERDEBT:
            return state.map(userDebt => userDebt.id === action.userDebt.id ? action.userDebt : userDebt)
        default:
            return state
    }
}