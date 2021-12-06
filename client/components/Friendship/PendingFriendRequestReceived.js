import React, { useState } from 'react'
import { connect } from 'react-redux'
import { deleteUserFriend, approveUserFriend, createUserFriend, getFriends, getFriendsPendingReceived } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, ButtonGroup, Grid, Paper, Typography, Snackbar, Alert, Avatar } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'


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

    return(
    <>
        <div>
        <h3>Pending Friend Requests You Received:</h3>
        <h5>{friendsPendingReceived.length === 0? "No pending friend requests received":""}</h5>
        </div>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {friendsPendingReceived.map(friendPendingReceived => (
                <Grid item xs={12} sm={3} key={friendPendingReceived.id}>
                    <Paper style={{width: 225, height: 110}} sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] }}}>
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }} src={friendPendingReceived.user.avatar}>
                                {friendPendingReceived.user.firstName[0]+friendPendingReceived.user.lastName[0]}
                            </Avatar>
                            <Typography variant='h6'>
                                {friendPendingReceived.user.username}
                            </Typography>
                            <ButtonGroup>
                            <Button startIcon={<CheckCircleIcon />} size="small" variant='contained' onClick={() => clickApproveRequest(friendPendingReceived)}>
                                Approve
                            </Button>
                            <Button startIcon={<CancelIcon />} size="small" variant='contained' onClick={() => clickRejectRequest(friendPendingReceived)}>
                                Reject
                            </Button>
                            </ButtonGroup>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {userFriend && userFriend.user ? `${userFriend.user.username} is now your friend!`:''}
            </Alert>
        </Snackbar>
        <Snackbar open={rejectOpen} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {userFriend && userFriend.user ? `${userFriend.user.username}'s friend request has been rejected!`:''}
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
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequestReceived)