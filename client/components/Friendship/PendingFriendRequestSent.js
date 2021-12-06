import React from 'react'
import { connect } from 'react-redux'
import { useState } from 'react'
import { deleteUserFriend, getFriends, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography, Snackbar, Alert, Avatar } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'


export const PendingFriendRequestSent = ({friendsPendingSent, deleteUserFriend, loadFriendshipData }) => {
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

    return(
    <>
        <div>
        <h3>Pending Friend Requests You Sent:</h3>
        <h5>{friendsPendingSent.length === 0? "No pending friend requests sent":""}</h5>
        </div>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {friendsPendingSent.map(friendPendingSent => (
                <Grid item xs={12} sm={3} key={friendPendingSent.id}>
                    <Paper style={{width: 225, height: 110}} sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }} src={friendPendingSent.friend.avatar}>
                                {friendPendingSent.friend.firstName[0]+friendPendingSent.friend.lastName[0]}
                            </Avatar>
                            <Typography variant='h6'>
                                {friendPendingSent.friend.username}
                            </Typography>
                            <Button startIcon={<CloseIcon />} size="small" variant='contained' onClick={() => clickRejectRequest(friendPendingSent)}>
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
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequestSent)