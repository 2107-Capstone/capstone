import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

/**
 * COMPONENT
 */
export const Home = ({ auth, users, trips, messages }) => {

  const user = users.find(user => user.id === auth.id);
  if (!user) {
    return (
      <h2>Home page with not one logged in</h2>
    )
  }

  const findParticipants = (id) => {
    return users.reduce((accum, user) => {
      !!user.userTrips.find(trip => trip.tripId === id) ? accum.push(user) : '';
      return accum;
    }, [])
  }
  const findMessages = (id) => {
    return messages.filter(message => message.tripId === id);
  }

  // if (users.length === 0 || trips.length === 0 || messages.length === 0) return '...loading'


  return (
    <div>
      <h3>Welcome, {user.username}</h3>

      <h3>{user.username}'s Friends</h3>
      <ul key={Math.random().toString(16)}>
        {
          user.userFriends.map(friend => (
            <li key={friend.id + Math.random().toString(16)}>
              {friend.friend.username}
            </li>
          ))
        }
      </ul>
      <h3>Trips for {user.username}</h3>
      <ul>
        {
          trips.map(trip => (
            <div key={trip.id + Math.random().toString(16)}>
              <li>
                {trip.trip.name}
              </li>
              Friends in Trip
              <ul>
                {
                  findParticipants(trip.tripId).map(user => (
                    <li key={user.id + Math.random().toString(16)}>{user.username}</li>
                  ))
                }
              </ul>
              Messages
              <ul key={trip.id + Math.random().toString(16)}>
                {
                  findMessages(trip.tripId).sort((a, b) => a.dateSent < b.dateSent ? -1 : 1).map(message => (
                    <li key={message.id + Math.random().toString(16)}>
                      {message.sentBy.username}: {message.content}
                    </li>
                  ))
                }
              </ul>
              <Link key={trip.id + Math.random().toString(16)} to={`/chat/${trip.tripId}`}>Chat</Link>
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
    messages: state.messages,

  }
}

export default connect(mapState)(Home)
