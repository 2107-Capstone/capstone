import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteUserFriend, approveUserFriend, createUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'
import auth from '../../store/auth'


export const PendingFriendRequest = ({auth, friendsPendingSent, friendsPendingReceived, deleteUserFriend, approveUserFriend, createUserFriend, loadFriendshipData }) => {
    const clickApproveFriend = async (userFriend) => {
        await approveUserFriend({
            ...userFriend,
            status: 'accepted'
        })
        await createUserFriend({
            userId: userFriend.friendId,
            friendId: userFriend.userId,
            status: 'accepted'
        })
        alert(`${userFriend.user.username} is now your friend!`)
        await loadFriendshipData()
    }
    
    const clickRejectFriend = async (userFriend) => {
        await deleteUserFriend(userFriend.id)
        await loadFriendshipData()
    }

    return(
    <div>
        <div>
        <h3>Pending Friend Requests You Sent:</h3>
        </div>
        <ul>
            {friendsPendingSent.map(friendPendingSent => (
                <li key={friendPendingSent.id}>
                    {friendPendingSent.friend.username}
                    <button onClick={() => clickRejectFriend(friendPendingSent)}>Cancel Request</button>
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
                    <button onClick={() => clickApproveFriend(friendPendingReceived)}>Approve</button>
                    <button onClick={() => clickRejectFriend(friendPendingReceived)}>Reject</button>
                </li>
            ))}
        </ul>
    </div>
    )
}

const mapState = state => {
    return {
      auth: state.auth,
      friendsPendingSent: state.friendsPendingSent,
      friendsPendingReceived: state.friendsPendingReceived
    }
  }

const mapDispatch = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        },
        approveUserFriend: (userFriend) => {
            dispatch(approveUserFriend(userFriend))
        },
        createUserFriend: (userFriend) => {
            dispatch(createUserFriend(userFriend))
        },
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequest)