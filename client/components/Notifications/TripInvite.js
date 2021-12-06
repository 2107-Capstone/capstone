import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Avatar, Button, Container, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'

/////////////// COMPONENTS ///////////////////

////////////// STORE ////////////////
import { getUserTrips } from '../../store'


const TripInvite = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserTrips())
    }, [])

    const user = useSelector(state => state.auth)
    const friends = useSelector(state => state.friends)

    const pendingInvites = useSelector(state => state.usertrips).filter(usertrip => usertrip.tripInvite === 'pending' && usertrip.userId === user.id) || []

    if (!pendingInvites || !friends) {
        return (<CircularLoading />)
    }

    const invites = pendingInvites.map(invite => {
        const friendInvite = friends.find(friend => friend.friendId === invite.sentBy * 1)
        if (friendInvite) {
            return { ...invite, friend: friendInvite.friend }
        }
    })

    const handleInvite = (friendId) => {
        // const invite = { tripId, userId: friendId, sentBy: user.id }
        // dispatch(inviteFriend(invite))
    }

    // const handleChange = (e) => {
    //     const value = e.target.value
    //     setsearch(value)
    // }


    return (
        <Box>
            <List>
                {/* {invitefriends.filter(friend => friend.friend.firstName.toLowerCase().startsWith(search)).map((friend, idx) => (
                    <Fragment key={idx} >
                        <ListItem
                            secondaryAction={
                                friend.tripInvite ? (friend.tripInvite === "accepted" ? (<Button disabled>
                                    accepted
                                </Button>) : (<Button disabled>
                                    ...pending
                                </Button>)) : (<Button variant='outlined' onClick={() => handleInvite(friend.friendId)}>
                                    Invite
                                </Button>)
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${friend.friend.firstName}`}
                            // secondary={friend.tripInvite==="accepted" ? 'Already on the trip' : 'pending request'}
                            />
                        </ListItem>
                        <Divider variant="inset" />
                    </Fragment >
                ))
                } */}
            </List >
        </Box >
    )
}

export default TripInvite
