import React from 'react'
import { connect } from 'react-redux'
import AddFriend from './AddFriend'
import PendingFriendRequest from './PendingFriendRequest'
import { deleteUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'


export const AllFriends = ({friends, userFriends, deleteUserFriend, loadFriendshipData }) => {
    const clickDeleteFriend = async (friend) => {
        const _userFriend = userFriends.find(userFriend => userFriend.userId === friend.friendId)
        await deleteUserFriend(friend.id)
        await deleteUserFriend(_userFriend.id)
        await loadFriendshipData()
    }
    return(
    <div>
        <div>
        <h3>Your Friends:</h3>
        </div>

        <ul>
            {friends.map(friend => (
                <li key={friend.id}>
                    {friend.friend.username}
                    <button onClick={() => clickDeleteFriend(friend)}>Delete Friend</button>

                </li>
            ))}
        </ul>
        <PendingFriendRequest />
        <AddFriend />
    </div>
    )
}

const mapState = state => {
    return {
      friends: state.friends,
      userFriends: state.userFriends
    }
}

const mapDispatch = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        },
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(AllFriends)