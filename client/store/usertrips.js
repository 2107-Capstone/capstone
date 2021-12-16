import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

//////////// ACTION TYPES  ////////////
const GET_USERTRIPS = 'GET_USERTRIPS'

const INVITE_FRIEND = 'INVITE_FRIEND'
const ACCEPT_INVITE = 'ACCEPT_INVITE'
const REJECT_INVITE = 'REJECT_INVITE'

//////////// ACTION CREATORS ////////////
const _getUserTrips = usertrips => ({ type: GET_USERTRIPS, usertrips })
const _inviteFriend = invited => ({ type: INVITE_FRIEND, invited })
const _acceptInvite = acceptedinvite => ({ type: ACCEPT_INVITE, acceptedinvite })
const _rejectInvite = rejectedinvite => ({ type: REJECT_INVITE, rejectedinvite })


//////////////////// THUNK CREATORS  //////////////
export const getUserTrips = () => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: usertrips } = await axios.get(`/api/usertrips`, {
            headers: {
                authorization: token
            }
        });
        dispatch(_getUserTrips(usertrips));
    };
}
export const inviteFriend = (invite) => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: invited } = await axios.post(`/api/usertrips`, { invite }, {
            headers: {
                authorization: token
            }
        });
        window.socket.send(JSON.stringify(_inviteFriend(invited)))
        dispatch(_inviteFriend(invited));
    };
}

export const acceptInvite = (invite) => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: acceptedinvite } = await axios.put(`/api/usertrips`, { invite }, {
            headers: {
                authorization: token
            }
        });
        window.socket.send(JSON.stringify(_acceptInvite(acceptedinvite)))
        dispatch(_acceptInvite(acceptedinvite));
    };
}

export const rejectInvite = (inviteId) => {
    const token = window.localStorage.getItem(TOKEN)
    return async (dispatch) => {
        const { data: rejectedinvite } = await axios.delete(`api/usertrips/${inviteId}`, {
            headers: {
                authorization: token
            }
        });
        window.socket.send(JSON.stringify(_rejectInvite(rejectedinvite)))
        dispatch(_rejectInvite(rejectedinvite));
    };
}

///////////// REDUCER ////////////////
export default function (state = [], action) {
    switch (action.type) {
        case GET_USERTRIPS:
            return action.usertrips
        case INVITE_FRIEND:
            return [action.invited, ...state]
        case ACCEPT_INVITE:
            state = state.filter(pendinginvite => pendinginvite.id !== action.acceptedinvite.id)
            return [action.acceptedinvite, ...state]
        case REJECT_INVITE:
            return state.filter(invite => invite.id !== action.rejectedinvite.id)
        default:
            return state
    }
}