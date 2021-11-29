import React from 'react'
import { connect } from 'react-redux'
import { deleteUserFriend, approveUserFriend, createUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, ButtonGroup, Grid, Paper, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'


export const PendingFriendRequest = ({friendsPendingSent, friendsPendingReceived, deleteUserFriend, approveUserFriend, createUserFriend, loadFriendshipData }) => {
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
        alert(`${userFriend.user.username} is now your friend!`)
        await loadFriendshipData()
    }
    
    const clickRejectRequest = async (userFriend) => {
        await deleteUserFriend(userFriend.id)
        await loadFriendshipData()
    }

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
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
        <div>
        <h3>Pending Friend Requests You Received:</h3>
        <h5>{friendsPendingReceived.length === 0? "No pending requests received":""}</h5>
        </div>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {friendsPendingReceived.map(friendPendingReceived => (
                <Grid item xs={12} sm={3} key={friendPendingReceived.id}>
                    <Paper style={{width: 225, height: 100}} sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] }}}>
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(PendingFriendRequest)