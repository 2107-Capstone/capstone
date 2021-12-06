import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import history from '../../../history'

/////////////// COMPONENTS ///////////////////
import CircularLoading from '../../Loading/CircularLoading';

///////////////// STORE ///////////////////////
import { getUserTrips, inviteFriend } from '../../../store';

/////////// MATERIAL UI /////////////////
import { Avatar, Button, Container, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';

const InviteToTrip = (props) => {
    const { handleClose } = props
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserTrips())
    }, [])

    const [search, setsearch] = useState('')

    /////// Get the trip id from the browser //////
    const path = history.location.pathname
    const tripId = path.slice(path.lastIndexOf('/') + 1) * 1

    const user = useSelector(state => state.auth)
    const friends = useSelector(state => state.friends)

    const usertrips = useSelector(state => state.usertrips).filter(usertrip => usertrip.tripId === tripId && usertrip.userId !== user.id)

    const invitefriends = friends.map(friend => {
        const invited = usertrips.find(user => user.userId === friend.friendId)

        if (invited) {
            return { ...friend, tripInvite: invited.tripInvite }
        }
        else {
            return friend
        }
    })

    if (!invitefriends) {
        return (<CircularLoading />)
    }

    const handleInvite = (friendId) => {
        const invite = { tripId, userId: friendId, sentBy: user.id }
        dispatch(inviteFriend(invite))
    }

    // let filteredFriends = [...inviteFriend]
    // const filter = (value) => {
    //     const friends = invitefriends.filter(friend => friend.friend.firstName.toLowerCase().startsWith(value))
    //     filteredFriends = [...friends]
    // }

    const handleChange = (e) => {
        // const name = e.target.name
        const value = e.target.value
        setsearch(value)

        // filter(search)
    }

    return (
        <Box sx={{ p: 3, minHeight: 400 }}>
            <IconButton onClick={() => handleClose()} sx={{ float: 'right' }} color='error'>
                <CloseIcon />
            </IconButton>
            <Typography align='center' variant='h5' gutterBottom>
                <PersonAddIcon />&nbsp;Invite Friends
            </Typography>
            <Paper
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '50%', m: '1rem auto' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    name='search'
                    placeholder="Search friend"
                    onChange={(e) => handleChange(e)}
                />
                <SearchIcon color='primary' />
            </Paper>

            <List>
                {invitefriends.filter(friend => friend.friend.firstName.toLowerCase().startsWith(search)).map((friend, idx) => (
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
                }
            </List >
        </Box >
    )
}

export default InviteToTrip
