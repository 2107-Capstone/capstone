import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'

///////////// COMPONENTS ////////////////////
import Home from './components/Home/Home';
import ChatRoom from './components/Chat/ChatRoom';
import Trip from './components/Trip/Trip';
import AllTripsMap from './components/Map/AllTripsMap';
import LoginForm from './components/User/LoginForm';
import SignupForm from './components/User/SignupForm';
import AllTrips from './components/Trips/AllTrips';
import AllFriends from './components/Friendship/AllFriends';
import AddTripFrom from './components/Trips/Form/AddTripFrom';
import TripCalendar from './components/Calendar/TripCalendar';
import SingleTripCalendar from './components/Calendar/SingleTripCalendar';
import Expenses from './components/Expenses/Expenses';
import TripMap from './components/Map/TripMap';
import Notifications from './components/Notifications/Notifications'
import Settings from './components/Settings/Settings';
import Password from './components/Settings/Password';
import AuthAvatar from './components/Settings/AuthAvatar';
// import Dashboard from './components/Dashboard/Dashboard';

///////////// STORE /////////////////////
import { me, getUsers, getTrips, getMessages, getFriends, getEvents, getExpenses, getCategories, getUserFriends, getFriendsPendingSent, getFriendsPendingReceived, getUserDebts } from './store'

//////////// MATERIAL UI /////////////////////////
import { Avatar, Container } from '@mui/material';
import { Box } from '@mui/system';


class Routes extends Component {
  constructor(props) {
    super()
  }

  async componentDidMount() {
    await this.props.loadInitialData();
    if (this.props.isLoggedIn) {
      await this.props.loadAppData();
    }
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      await this.props.loadAppData()
    }
  }

  render() {
    const { isLoggedIn } = this.props

    return (
      <>
        <Route exact path='/' component={Home} />
        <Route path="/home" component={Home} />

        <Container maxWidth='lg'>
          {
            isLoggedIn ? (
              <Switch>
                {/* <Route exact path="/dashboard" component={Dashboard} /> */}
                <Route exact path="/trips" component={AllTrips} />
                <Route exact path="/trips/add" component={AddTripFrom} />
                <Route exact path="/trips/:id" component={Trip} />
                <Route exact path="/friends" component={AllFriends} />
                <Route exact path="/trips/:id/chat" component={ChatRoom} />
                <Route exact path="/trips/:id/expenses" component={Expenses} />
                <Route exact path="/trips/:id/map" component={TripMap} />
                <Route exact path="/trips/:id/calendar" component={SingleTripCalendar} />
                <Route exact path="/map" component={AllTripsMap} />
                <Route exact path="/calendar" component={TripCalendar} />
                <Route exact path="/notifications" component={Notifications} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/settings/password" component={Password} />
                <Route exact path="/settings/authavatar" component={AuthAvatar} />
                <Redirect to="/home" />
              </Switch >
            ) : (
              <Switch>
                <Route path="/login" component={LoginForm} />
                <Route path="/signup" component={SignupForm} />
              </Switch>
            )
          }
        </Container>
      </>
    )
  }
}

const mapState = state => {
  return {
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
      dispatch(getCategories())
      dispatch(getUserFriends())
      dispatch(getFriendsPendingSent())
      dispatch(getFriendsPendingReceived())
      dispatch(getUserDebts())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Routes))
