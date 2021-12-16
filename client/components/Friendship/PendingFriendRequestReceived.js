import React, { useState } from 'react'
import { connect } from 'react-redux'
import { deleteUserFriend, approveUserFriend, createUserFriend, getFriends, getFriendsPendingReceived } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, ButtonGroup, Grid, Paper, Typography, Snackbar, Alert, Avatar, Stack } from "@mui/material"
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Pending as PendingIcon } from '@mui/icons-material'

export const PendingFriendRequestReceived = ({ friendsPendingReceived, deleteUserFriend, approveUserFriend, createUserFriend, loadFriendshipData }) => {
    const clickApproveRequest = async (userFriend) => {
        await approveUserFriend({
            ...userFriend,
            status: 'accepted'
        })
        await createUserFriend({
            userId: userFriend.friendId,
            friendId: userFriend.userId,
            status: 'accepted'
        })
        handleClick(userFriend)
        await loadFriendshipData()
    }

    const clickRejectRequest = async (userFriend) => {
        await deleteUserFriend(userFriend.id)
        handleRejectClick(userFriend)
        await loadFriendshipData()
    }

    const [open, setOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [userFriend, setUserFriend] = useState({});

    const handleClick = (userFriend) => {
        setOpen(true);
        setUserFriend(userFriend)
    };

    const handleRejectClick = (userFriend) => {
        setRejectOpen(true);
        setUserFriend(userFriend)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setRejectOpen(false)
        setUserFriend({})
    };

    return (
        <>
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                    <PendingIcon fontSize='medium' />
                    <Typography variant='h5'>
                        &nbsp;Pending Friend Requests You Received
                    </Typography>
                </Box>
                <Typography align='center' variant='h6' sx={{ mt: 4, mb: 4 }}>
                    {friendsPendingReceived.length === 0 ? "No pending friend requests received" : ""}
                </Typography>
            </div>
            <Grid container spacing={2} sx={{ mt: 4, mb: 4 }}>
                {friendsPendingReceived.map(friendPendingReceived => (
                    <Grid item xs={12} sm={4} md={3} key={friendPendingReceived.id}>
                        <Paper elevation={1}>
                            <Box sx={{ py: 1, color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }} src={friendPendingReceived.user.avatar}>
                                    {friendPendingReceived.user.firstName[0] + friendPendingReceived.user.lastName[0]}
                                </Avatar>
                                <Typography variant='h6'>
                                    {friendPendingReceived.user.username}
                                </Typography>
                                {/* <ButtonGroup> */}
                                <Stack spacing={0.5}>
                                    <Button color='success' startIcon={<CheckCircleIcon />} size="small" variant='outlined' onClick={() => clickApproveRequest(friendPendingReceived)}>
                                        Approve
                                    </Button>
                                    <Button color='error' startIcon={<CancelIcon />} size="small" variant='outlined' onClick={() => clickRejectRequest(friendPendingReceived)}>
                                        Reject
                                    </Button>
                                </Stack>
                                {/* </ButtonGroup> */}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {userFriend && userFriend.user ? `${userFriend.user.username} is now your friend!` : ''}
                </Alert>
            </Snackbar>
            <Snackbar open={rejectOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {userFriend && userFriend.user ? `${userFriend.user.username}'s friend request has been rejected!` : ''}
                </Alert>
            </Snackbar>
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

const mapDispatch = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        },
        approveUserFriend: (userFriend) => {
            dispatch(approveUserFriend(userFriend))
        },
        createUserFriend: (userFriend) => {
            dispatch(createUserFriend(userFriend))
        },
        loadFriendshipData() {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequestReceived)