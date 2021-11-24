import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AddFriend from './AddFriend'
import PendingFriendRequest from './PendingFriendRequest'


export const AllFriends = ({friends}) => {
    return(
    <div>
        <div>
        <h3>Your Friends:</h3>
        </div>

        <ul>
            {friends.map(friend => (
                <li key={friend.id}>
                    {friend.friend.username}
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
    }
  }

export default connect(mapState)(AllFriends)