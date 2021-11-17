import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
// import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import ChatRoom from './components/Chat/ChatRoom';
import Trip from './components/Trip/Trip';
import TripMap from './components/Map/TripMap';
import { me, getUsers, getTrips, getMessages, getFriends, getEvents, getExpenses } from './store'
import LoginForm from './components/User/LoginForm';
import SignupForm from './components/User/SignupForm';

import AllTrips from './components/Trips/AllTrips';
import AllFriends from './components/Friendship/AllFriends';
import Dashboard from './components/Dashboard/Dashboard';

/**
 * COMPONENT
 */
class Routes extends Component {
  async componentDidMount() {
    await this.props.loadInitialData();
    await this.props.loadAppData();
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      await this.props.loadAppData()
    }
  }

  render() {
    const { isLoggedIn } = this.props

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/trips" component={AllTrips} />
            <Route exact path="/trip/:id" component={Trip} />
            <Route exact path="/friends" component={AllFriends} />
            <Route exact path="/trip/:id/chat" component={ChatRoom} />
            {/* <Route exact path="/trip/:id/map" component={TripMap} /> */}
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/home" component={Home} />
            {/* <Route path='/' exact component={Login} /> */}
            <Route path="/login" component={LoginForm} />
            <Route path="/signup" component={SignupForm} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    },
    loadAppData() {
      dispatch(getUsers())
      dispatch(getTrips())
      dispatch(getMessages())
      dispatch(getFriends())
      dispatch(getEvents())
      dispatch(getExpenses())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
