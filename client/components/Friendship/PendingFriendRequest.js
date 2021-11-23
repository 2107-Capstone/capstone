import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteUserFriend } from '../../store'


export const PendingFriendRequest = ({friendsPendingSent, friendsPendingReceived, deleteUserFriend }) => {
    return(
    <div>
        <div>
        <h3>Pending Friend Requests You Sent:</h3>
        </div>
        <ul>
            {friendsPendingSent.map(friendPendingSent => (
                <li key={friendPendingSent.id}>
                    {friendPendingSent.friend.username}
                    <button onClick={() => deleteUserFriend(friendPendingSent.id)}>Cancel Request</button>
                </li>
            ))}
        </ul>
        <div>
        <h3>Pending Friend Requests You Received:</h3>
        </div>
        <ul>
            {friendsPendingReceived.map(friendPendingReceived => (
                <li key={friendPendingReceived.id}>
                    {friendPendingReceived.user.username}
                    <button>Approve</button>
                    <button onClick={() => deleteUserFriend(friendPendingReceived.id)}>Reject</button>
                </li>
            ))}
        </ul>
    </div>
    )
}

const mapState = state => {
    return {
      friendsPendingSent: state.friendsPendingSent,
      friendsPendingReceived: state.friendsPendingReceived
    }
  }

const mapProps = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        }
    }
}

export default connect(mapState, mapProps)(PendingFriendRequest)