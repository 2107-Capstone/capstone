import React from 'react'
import { connect } from 'react-redux'
import { useState } from 'react'
import { deleteUserFriend, getFriends, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography, Snackbar, Alert, Avatar } from "@mui/material"
import {Close as CloseIcon, Pending as PendingIcon} from '@mui/icons-material'

export const PendingFriendRequestSent = ({ friendsPendingSent, deleteUserFriend, loadFriendshipData }) => {
    const clickRejectRequest = async (userFriend) => {
        await deleteUserFriend(userFriend.id)
        await loadFriendshipData()
        handleClick()
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

    return (
        <>
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                    <PendingIcon fontSize='medium' />
                    <Typography variant='h5'>
                        &nbsp;Pending Friend Requests You Sent
                    </Typography>
                </Box>
                <Typography align='center' variant='h6' sx={{ mt: 4, mb: 4 }}>
                    {friendsPendingSent.length === 0 ? "No pending friend requests sent" : ""}
                </Typography>
            </div>
            <Grid container spacing={2} sx={{ mt: 4, mb: 4 }} >
                {friendsPendingSent.map(friendPendingSent => (
                    <Grid item xs={12} sm={4} md={3} key={friendPendingSent.id}>
                        <Paper elevation={1}>
                            <Box sx={{ py: 1, color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }} src={friendPendingSent.friend.avatar}>
                                    {friendPendingSent.friend.firstName[0] + friendPendingSent.friend.lastName[0]}
                                </Avatar>
                                <Typography variant='h6'>
                                    {friendPendingSent.friend.username}
                                </Typography>
                                <Button color='error' startIcon={<CloseIcon />} size="small" variant='outlined' onClick={() => clickRejectRequest(friendPendingSent)}>
                                    Cancel Request
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Friend request has been cancelled!
                </Alert>
            </Snackbar>
        </>
    )
}

const mapState = state => {
    return {
        auth: state.auth,
        friendsPendingSent: state.friendsPendingSent,
    }
}

const mapDispatch = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        },
        loadFriendshipData() {
            dispatch(getFriends())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequestSent)