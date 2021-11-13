import React from 'react'
import {connect} from 'react-redux'
import { getUsers, getTrips, getMessages } from '../store'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import messages from '../store/messages'
/**
 * COMPONENT
 */
export const Home = ({auth, users, getUsers, trips, getTrips, messages, getMessages }) => {
  
  useEffect(() => {
    const loadData = async() => {
      await getUsers();
      await getTrips();
      await getMessages();
    }
    loadData();
  }, [])
  
  const user = users.find(user => user.id === auth.id);
  
  console.log(user)
  console.log(trips)
  console.log(messages)


  if (users.length === 0 || trips.length === 0 || messages.length === 0) return '...loading'
  // if (users.length === 0 || trips.length === 0 ) return '...loading'
  return (
    <div>
      <h3>Welcome, {user.username}</h3>
      {/* <ul>
        {
          users.map(user => (
            <li key={user.id}>
              {user.username}
            </li>
          ))
        }
      </ul> */}
      <h3>{user.username}'s Friends</h3>
        <ul key={Math.random().toString(16)}>
          {
          user.userFriends.map(friend => (
            <li key={friend.id+ Math.random().toString(16)}>
              {friend.friend.username}
            </li>
          ))
          }
        </ul>
      <h3>Trips for {user.username}</h3>
      <ul>
        {
          trips.map(trip => (
            <div key={trip.id+Math.random().toString(16)}>
              <li>
                {trip.trip.name}
              </li>
              <ul>
                Friends in trip
                
              </ul>
              <ul key={trip.id + Math.random().toString(16)}>
              {
                trip.trip.messages.sort((a,b) => a.dateSent < b.dateSent ? -1 : 1).map(message => (
                  
                  <li key={message.id+ Math.random().toString(16)}>
                    {message.content}
                  </li>
                  
                  ))
                }
              </ul>
              <Link key={trip.id+Math.random().toString(16)} to={`/chat/${trip.trip.name}`}>Chat</Link>
          </div>
          ))
        }
      </ul>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    auth: state.auth,
    users: state.users,
    trips: state.trips,
    messages: state.messages
  }
}
const mapDispatch = dispatch => {
  return {
    getUsers: () => dispatch(getUsers()),
    getTrips: () => dispatch(getTrips()),
    getMessages: () => dispatch(getMessages()),
  }
}

export default connect(mapState, mapDispatch)(Home)
