import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AddFriend from './AddFriend'


export const AllFriends = ({auth, users, friends}) => {
    return(
    <div>
        <div>
        <h3>{auth.username}'s Friends</h3>
        </div>

        <ul>
            {friends.map(friend => (
                <li key={friend.id}>
                    {friend.friend.username}
                </li>
            ))}
        </ul>
        <AddFriend />
    </div>
    )
}

const mapState = state => {
    return {
      auth: state.auth,
      users: state.users,
      friends: state.friends,
    }
  }

export default connect(mapState)(AllFriends)