import React, { useState, Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import AddFriend from './AddFriend'
import PendingFriendRequestSent from './PendingFriendRequestSent'

import { deleteUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography, Snackbar, IconButton, Alert, Avatar, Divider } from "@mui/material"
import { People as PeopleIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material'
import CircularLoading from '../Loading/CircularLoading'


export const AllFriends = ({ friends, userFriends, deleteUserFriend, loadFriendshipData }) => {
    const clickDeleteFriend = async (friend) => {
        const _userFriend = userFriends.find(userFriend => userFriend.userId === friend.friendId)
        await deleteUserFriend(friend.id)
        await deleteUserFriend(_userFriend.id)
        handleClick(friend)
        handleClose()
        handleDeleteClick(friend)
        await loadFriendshipData()
    }

    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [friend, setFriend] = useState({});

    const handleClick = (friend) => {
        setOpen(true);
        setFriend(friend)
    };

    const handleDeleteClick = (friend) => {
        setDeleteOpen(true);
        setFriend(friend)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setDeleteOpen(false);
        setFriend({})
    };

    if (!friends) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <PeopleIcon fontSize='medium' />
                    <Typography variant='h5'>
                        &nbsp;ALL FRIENDS
                    </Typography>
                </Box>
                <CircularLoading />
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <PeopleIcon fontSize='medium' />
                <Typography variant='h5'>
                    &nbsp;ALL FRIENDS
                </Typography>
            </Box>
            <Typography align='center'>
                {friends.length === 0 ? "No friends" : ""}
            </Typography>
            <Grid container spacing={2} sx={{ my: 4 }}>
                {friends.map(friend => (
                    <Grid item xs={12} sm={4} md={3} key={friend.id}>
                        <Paper elevation={1}>
                            <Box sx={{ py: 1, color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }} src={friend.friend.avatar}>
                                    {friend.friend.firstName[0] + friend.friend.lastName[0]}
                                </Avatar>
                                <Typography variant='h6'>
                                    {friend.friend.username}
                                </Typography>
                                <Button color='error' startIcon={<DeleteIcon />} size="small" variant='outlined' onClick={() => handleClick(friend)}>
                                    Delete Friend
                                </Button>

                            </Box>
                        </Paper>
                    </Grid>

                ))}
            </Grid>
            <Snackbar
                sx={{ mt: 9 }}
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={6000}
                onClose={handleClose}
                message={friend && friend.friend ? `Are you sure you wish to delete ${friend.friend.username} as a friend?` : ''}
                action={
                    <Fragment>
                        <Button color="secondary" size="small" onClick={() => clickDeleteFriend(friend)}>
                            YES
                        </Button>
                        <Button color="secondary" size="small" onClick={handleClose}>
                            NO
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                }
            />
            <Snackbar open={deleteOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {friend && friend.friend ? `${friend.friend.username} has been deleted as a friend!` : ''}
                </Alert>
            </Snackbar>
            <Divider />
            <PendingFriendRequestSent />
            <Divider />
            <AddFriend />
        </>
    )
}

const mapState = state => {
    return {
        friends: state.friends,
        userFriends: state.userFriends
    }
}

const mapDispatch = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        },
        loadFriendshipData() {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(AllFriends)