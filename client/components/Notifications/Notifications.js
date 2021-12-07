import { Divider, Typography } from '@mui/material'
import React from 'react'
import { connect } from 'react-redux'
import PendingFriendRequestReceived from '../Friendship/PendingFriendRequestReceived'
import TripInvite from './TripInvite'
import LuggageIcon from '@mui/icons-material/Luggage';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Debts from './Debts'

export const Notifications = () => {
  return (
    <>
      <Typography sx={{ mt: 2 }} align='center' variant='h5' gutterBottom>
        <PersonAddIcon />&nbsp;Friend Requests
      </Typography>
      <PendingFriendRequestReceived />
      {/* Add pending trip requets */}
      <Divider />
      <Typography sx={{ mt: 2 }} align='center' variant='h5' gutterBottom>
        <LuggageIcon />&nbsp;Trip Invites
      </Typography>
      <TripInvite />
      <Divider />
      <Typography sx={{ mt: 2 }} align='center' variant='h5' gutterBottom>
        <LuggageIcon />&nbsp;Unpaid Expenses
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