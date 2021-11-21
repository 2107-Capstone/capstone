import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { createUserFriend } from '../../store'

export const AddFriend = ({auth, users, friends, createUserFriend, friendsPending}) => {
    const [query, setQuery] = useState('')
    const clickAddFriend = async (friendId) => {
        await createUserFriend({
            userId: auth.id,
            friendId: friendId
        })
    }
    const friendIds = new Set(friends.map(friend => friend.friendId))
    const friendPendingIds = new Set(friendsPending.map(friendPending => friendPending.friendId))
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
                    {friendIds.has(user.id)? <button disabled >Already Friend</button>:(friendPendingIds.has(user.id)? <button disabled >Request Pending</button>:<button onClick={() => clickAddFriend(user.id)}>Add Friend</button>)}
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
      friendsPending: state.friendsPending
    }
}

const mapProps = (dispatch) => {
    return {
        createUserFriend: (userFriend) => {
            dispatch(createUserFriend(userFriend))
        }
    }
}

export default connect(mapState, mapProps)(AddFriend)