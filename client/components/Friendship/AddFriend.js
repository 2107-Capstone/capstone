import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { useState } from 'react'
import { createUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Typography, TextField, Snackbar, Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from "@mui/material"
import { CheckCircle as CheckCircleIcon, Pending as PendingIcon, AddCircle as AddCircleIcon, PersonAdd as PersonAddIcon, Search as SearchIcon } from '@mui/icons-material'


export const AddFriend = ({ auth, users, friends, createUserFriend, friendsPendingSent, friendsPendingReceived, loadFriendshipData }) => {
    const [query, setQuery] = useState('')
    const [disabled, setDisabled] = useState(false)
    const clickAddFriend = async (friendId) => {
        await createUserFriend({
            userId: auth.id,
            friendId: friendId
        })
        handleClick()
        await loadFriendshipData()
        setDisabled(false)
    }
    
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const friendIds = new Set(friends.map(friend => friend.friendId))
    const friendPendingSentIds = new Set(friendsPendingSent.map(friendPendingSent => friendPendingSent.friendId))
    const friendPendingReceivedIds = new Set(friendsPendingReceived.map(friendPendingReceived => friendPendingReceived.userId))

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <PersonAddIcon fontSize='medium' />
                <Typography variant='h5'>
                    &nbsp;Add Friend
                </Typography>
            </Box>
            <Box
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '50%', m: '1rem auto' }}
            >
                <TextField
                    sx={{ ml: 1, flex: 1 }}
                    style={{ width: 500 }}
                    label='Search by username or email'
                    onChange={ev => setQuery(ev.target.value)}
                />
            </Box>
            <List>
                {users
                    .filter(user => user.id !== auth.id && user.username !== 'Admin')
                    .filter(user => {
                        if (query === '') {
                            return ''
                        } else if (user.username.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase() === query.toLowerCase()) {
                            return user
                        }
                    })
                    .map((user, idx) => (
                        <Fragment key={idx} >
                            <ListItem
                                secondaryAction={
                                    friendIds.has(user.id) ? <Button disabled startIcon={<CheckCircleIcon />} size="small" variant='contained' >Already Friend</Button> : (friendPendingSentIds.has(user.id) || friendPendingReceivedIds.has(user.id) ? <Button disabled startIcon={<PendingIcon />} size="small" variant='contained' >Request Pending</Button> : <Button startIcon={<AddCircleIcon />} size="small" variant='contained' onClick={() => {clickAddFriend(user.id); setDisabled(true)}} disabled={disabled}>Add Friend</Button>)
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }} src={user.avatar}>
                                        {user.firstName[0] + user.lastName[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${user.username}`}
                                />
                            </ListItem>
                            <Divider variant="inset" />
                        </Fragment >
                    ))}
            </List >
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Friend request has been sent!
                </Alert>
            </Snackbar>
        </>
    )
}




const mapState = state => {
    return {
        auth: state.auth,
        users: state.users,
        friends: state.friends,
        friendsPendingSent: state.friendsPendingSent,
        friendsPendingReceived: state.friendsPendingReceived,
    }
}

const mapDispatch = (dispatch) => {
    return {
        createUserFriend: (userFriend) => {
            dispatch(createUserFriend(userFriend))
        },
        loadFriendshipData() {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(AddFriend)