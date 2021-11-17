import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export const Friends = ({auth, users, friends}) => {
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
        <h3>Add a New Friend</h3>
        <input placeholder='search by username'></input>
        <ul>
            {users.map(user => (
                <li>
                    {user.username}
                    <button>+</button>
                </li>
            ))}
        </ul>
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

export default connect(mapState)(Friends)