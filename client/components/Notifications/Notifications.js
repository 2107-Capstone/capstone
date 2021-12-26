import React from 'react'
import { connect } from 'react-redux'

/////////// Material UI //////////////////
import { Divider, Typography } from '@mui/material'
import { Luggage as LuggageIcon, PersonAdd as PersonAddIcon, Paid as PaidIcon } from '@mui/icons-material';

///////////////// COMPONENTS /////////////////////
import PendingFriendRequestReceived from '../Friendship/PendingFriendRequestReceived'
import TripInvite from './TripInvite'
import Debts from './Debts'


export const Notifications = () => {
  return (
    <>
      <PendingFriendRequestReceived />
      <Divider />
      <Typography sx={{ mt: 4 }} align='center' variant='h5' gutterBottom>
        <LuggageIcon />&nbsp;Trip Invites
      </Typography>
      <TripInvite />
      <Divider />
      
      <Typography sx={{ mt: 4 }} align='center' variant='h5' gutterBottom>
        <PaidIcon />&nbsp;Money Owed from Closed Trips
      </Typography>
      <Debts />

    </>
  )
}
const mapState = state => {
  return {
    auth: state.auth,
    friendsPendingSent: state.friendsPendingSent,
    friendsPendingReceived: state.friendsPendingReceived
  }
}

export default connect(mapState)(Notifications)