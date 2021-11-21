import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'


export const PendingFriendRequest = ({friendsPending}) => {
    return(
    <div>
        <div>
        <h3>Your Pending Friend Requests:</h3>
        </div>
        <ul>
            {friendsPending.map(friendPending => (
                <li key={friendPending.id}>
                    {friendPending.friend.username}
                    <button>Approve</button>
                    <button>Reject</button>
                </li>
            ))}
        </ul>
    </div>
    )
}

const mapState = state => {
    return {
      friendsPending: state.friendsPending
    }
  }

export default connect(mapState)(PendingFriendRequest)