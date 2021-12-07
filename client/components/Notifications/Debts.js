import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Avatar, Button, Divider, List, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

/////////////// COMPONENTS ///////////////////

////////////// STORE ////////////////
import {  getUserDebts } from '../../store'
import { acceptInvite, rejectInvite } from "../../store/usertrips";


const Debts = () => {
    ///////////// Media Query /////////////
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    let flexdirection = 'row'
    if (matches) {
        flexdirection = 'column'
    }
    else {
        flexdirection = 'row'
    }

    const dispatch = useDispatch()
    const closedTrips = useSelector(state => state.trips.filter(trip => !trip.trip.isOpen));

    useEffect(async () => {
        try {
            await dispatch(getUserDebts())
        } catch (error) {
            console.log(error)
        }
    }, [])

    const userDebts = useSelector(state => state.userDebts.filter(debt => debt.status === 'pending'))

    const [users, auth] = useSelector(state => [state.users, state.auth])
    
    if (!users || !auth || !closedTrips || !userDebts) {
        return (<CircularLoading />)
    }

    const tripDebts = closedTrips.map(trip => {
        return (
            {[trip.trip.name]: userDebts.filter(debt => debt.tripId === trip.tripId)}
        )
    })

    console.log(tripDebts)

    if (userDebts.length === 0) {
        return (
            <Typography align='center' variant='h6'>
                You do not have any unpaid expenses.
            </Typography>
        )
    }

     return (
        <div>
            hi

        </div> 
     )
    //     <List>
    //         {invites.map((invite, idx) => (
    //             <Fragment key={idx}>
    //                 <Box sx={{
    //                     display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: `${flexdirection}`
    //                 }}>
    //                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //                         <Avatar src={invite.friend.avatar} >
    //                             {invite.friend.firstName[0] + invite.friend.lastName[0]}
    //                         </Avatar>
    //                         <Box sx={{ m: 1 }}>
    //                             <Typography>
    //                                 {invite.friend.firstName}
    //                             </Typography>
    //                             <Typography variant='body2'>
    //                                 {`Invite to ${invite.trip.location}`}
    //                             </Typography>
    //                         </Box>
    //                     </Box>
    //                     <Box sx={{ '& button': { m: .5 }, alignSelf: 'center' }}>
    //                         <Button onClick={() => handleAcceptInvite(invite.id)} startIcon={<CheckIcon />} size="small" variant='outlined' color='success'>
    //                             accept
    //                         </Button>
    //                         <Button onClick={() => handleRejectInvite(invite.id)} startIcon={<CloseIcon />} size="small" variant='outlined' color='error'>
    //                             reject
    //                         </Button>
    //                     </Box>
    //                 </Box>

    //                 <Divider />
    //             </Fragment>
    //         ))
    //         }
    //     </List >
    // )
}

export default Debts
