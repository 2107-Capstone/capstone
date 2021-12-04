import React from 'react'
import { connect } from 'react-redux'
import { useState } from 'react'
import { deleteUserFriend, getFriends, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography, Snackbar, Alert } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'


export const PendingFriendRequestSent = ({friendsPendingSent, deleteUserFriend, loadFriendshipData }) => {
    const clickRejectRequest = async (userFriend) => {
        await deleteUserFriend(userFriend.id)
        await loadFriendshipData()
        handleCancelClick()
    }

    const [cancelOpen, setCancelOpen] = useState(false);

    const handleCancelClick = () => {
        setCancelOpen(true);
    };

    const handleCancelClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setCancelOpen(false);
    };

    return(
    <>
        <div>
        <h3>Pending Friend Requests You Sent:</h3>
        <h5>{friendsPendingSent.length === 0? "No pending requests sent":""}</h5>
        </div>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {friendsPendingSent.map(friendPendingSent => (
                <Grid item xs={12} sm={3} key={friendPendingSent.id}>
                    <Paper style={{width: 225, height: 100}} sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h6'>
                                {friendPendingSent.friend.username}
                            </Typography>
                            <Button startIcon={<CloseIcon />} size="small" variant='contained' onClick={() => clickRejectRequest(friendPendingSent)}>
                                Cancel Request
                            </Button>
                            <Snackbar open={cancelOpen} autoHideDuration={6000} onClose={handleCancelClose}>
                                <Alert onClose={handleCancelClose} severity="success" sx={{ width: '100%' }}>
                                    Friend request has been cancelled!
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
      friendsPendingSent: state.friendsPendingSent,
    }
  }

const mapDispatch = (dispatch) => {
    return {
        deleteUserFriend: (id) => {
            dispatch(deleteUserFriend(id))
        },
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequestSent)