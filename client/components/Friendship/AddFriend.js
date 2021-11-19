import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export const AddFriend = ({auth, users, friends}) => {
    
    return(
    <div>
        <h3>Add a New Friend!!!</h3>
        <form>
        </form>
        {/* <input placeholder='search by username'></input>
        <ul>
            {users.map(user => (
                <li key={user.id} >
                    {user.username}
                    <button>+</button>
                </li>
            ))}
        </ul> */}
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