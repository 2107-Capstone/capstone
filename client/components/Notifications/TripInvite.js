import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from "@emotion/react";

/////////////// MATERIAL UI ///////////////////////
import { Box, Avatar, Button, Divider, List, Typography, useMediaQuery } from '@mui/material'
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

////////////// STORE ////////////////
import { getUserTrips } from '../../store'
import { acceptInvite, rejectInvite } from "../../store/usertrips";

const TripInvite = () => {
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

    useEffect(async () => {
        try {
            await dispatch(getUserTrips())
        } catch (error) {
            console.log(error)
        }
    }, [])

    const user = useSelector(state => state.auth)
    const friends = useSelector(state => state.friends)

    const pendingInvites = useSelector(state => state.usertrips).filter(usertrip => usertrip.tripInvite === 'pending' && usertrip.userId === user.id) || []

    if (!pendingInvites || !friends) {
        return (<CircularLoading />)
    }
    console.log(pendingInvites)
    const invites = pendingInvites.map(invite => {
        const friendInvite = friends.find(f => f.friendId === invite.sentBy)
        if (friendInvite.friend) {
            return { ...invite, friend: friendInvite.friend }
        }
    })

    const handleAcceptInvite = async (inviteId) => {
        try {
            const invite = { id: inviteId, tripInvite: 'accepted' }
            await dispatch(acceptInvite(invite))
        } catch (error) {
            console.log(error)
        }
    }

    const handleRejectInvite = async (inviteId) => {
        try {
            await dispatch(rejectInvite(inviteId))

        } catch (error) {
            console.log(error)
        }
    }

    if (invites.length === 0) {
        return (
            <Typography align='center' variant='h6' sx={{ mt: 4, mb: 8 }}>
                No pending trip invites
            </Typography>
        )
    }

    return (
        <List sx={{ mt: 4, mb: 4 }}>
            {invites.map((invite, idx) => (
                <Fragment key={idx}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: `${flexdirection}`
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={invite.friend.avatar} >
                                {invite.friend.firstName[0] + invite.friend.lastName[0]}
                            </Avatar>
                            <Box sx={{ m: 1 }}>
                                <Typography>
                                    {invite.friend.firstName}
                                </Typography>
                                <Typography variant='body2'>
                                    {`Invite to ${invite.trip.name}`}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ '& button': { m: .5 }, alignSelf: 'center' }}>
                            <Button onClick={() => handleAcceptInvite(invite.id)} startIcon={<CheckIcon />} size="small" variant='outlined' color='success'>
                                accept
                            </Button>
                            <Button onClick={() => handleRejectInvite(invite.id)} startIcon={<CloseIcon />} size="small" variant='outlined' color='error'>
                                reject
                            </Button>
                        </Box>
                    </Box>

                    <Divider />
                </Fragment>
            ))
            }
        </List >
    )
}

export default TripInvite
