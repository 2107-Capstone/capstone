import React from 'react'
import { connect } from 'react-redux'
import PendingFriendRequestReceived from '../Friendship/PendingFriendRequestReceived'


export const Notifications = () => {
    return(
    <>
        <PendingFriendRequestReceived />
        {/* Add pending trip requets */}
    </>
    )
}

const mapState = state => {
    return {
      auth: state.auth,
      friendsPendingSent: state.friendsPendingSent,
      friendsPendingReceived: state.friendsPendingReceived
    }
  }

export default connect(mapState)(Notifications)