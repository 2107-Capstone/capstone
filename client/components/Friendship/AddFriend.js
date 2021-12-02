import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { createUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography, TextField, Snackbar, Alert } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const AddFriend = ({auth, users, friends, createUserFriend, friendsPendingSent, friendsPendingReceived, loadFriendshipData}) => {
    const [query, setQuery] = useState('')
    const clickAddFriend = async (friendId) => {
        await createUserFriend({
            userId: auth.id,
            friendId: friendId
        })
        handleClick()
        await loadFriendshipData()
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

    return(
    <>
        <h3>Search below to add a new friend!!!</h3>
        <TextField 
            style={{width: 500}}
            label='Search by username or email'
            onChange={ev => setQuery(ev.target.value)}
        />
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {users
            .filter(user => user.id != auth.id)
            .filter(user => {
                if (query === '') {
                    return ''
                } else if (user.username.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase() === query.toLowerCase()) {
                    return user
                }
            })
            .map(user => (
                <Grid item xs={12} sm={3} key={user.id}>
                    <Paper style={{width: 225, height: 100}} sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h6'>
                                {user.username}
                            </Typography>
                            {friendIds.has(user.id)? <Button disabled startIcon={<CheckCircleIcon />} size="small" variant='contained' >Already Friend</Button>:(friendPendingSentIds.has(user.id) || friendPendingReceivedIds.has(user.id)? <Button disabled startIcon={<PendingIcon />} size="small" variant='contained' >Request Pending</Button>:<Button startIcon={<AddCircleIcon />} size="small" variant='contained' onClick={() => clickAddFriend(user.id)}>Add Friend</Button>)}
                            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                    Friend request has been sent!
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
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
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(AddFriend)