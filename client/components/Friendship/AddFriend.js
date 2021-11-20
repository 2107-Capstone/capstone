import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export const AddFriend = ({auth, users, friends}) => {
    const [query, setQuery] = useState('')
    const clickAddFriend = () => alert('Friend request has been sent!')
    return(
    <div>
        <h3>Add a New Friend!!!</h3>
        <input placeholder='Search by username or email' onChange={ev => setQuery(ev.target.value)}/>
        <ul>
            {users
            .filter(user => user.id != auth.id)
            .filter(user => {
                if (query === '') {
                    return ''
                } else if (user.username.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase())) {
                    return user
                }
            })
            .map(user => (
                <li key={user.id} >
                    {user.username}
                    <button onClick={clickAddFriend}>Add Friend</button>
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

export default connect(mapState)(AddFriend)