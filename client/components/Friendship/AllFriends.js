import React from 'react'
import { connect } from 'react-redux'
import AddFriend from './AddFriend'
import PendingFriendRequest from './PendingFriendRequest'
import { deleteUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography } from "@mui/material"
import PeopleIcon from '@mui/icons-material/People'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularLoading from '../Loading/CircularLoading'




export const AllFriends = ({friends, userFriends, deleteUserFriend, loadFriendshipData }) => {
    const clickDeleteFriend = async (friend) => {
        const _userFriend = userFriends.find(userFriend => userFriend.userId === friend.friendId)
        await deleteUserFriend(friend.id)
        await deleteUserFriend(_userFriend.id)
        await loadFriendshipData()
    }

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

    return(
        <>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
            <PeopleIcon fontSize='medium' />
            <Typography variant='h5'>
                &nbsp;ALL FRIENDS
            </Typography>
        </Box>
        <h3>Your Friends:</h3>
        <h5>{friends.length === 0? "No friends":""}</h5>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {friends.map(friend => (
                <Grid item xs={12} sm={3} key={friend.id}>
                    <Paper style={{width: 225, height: 100}} sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h6'>
                                {friend.friend.username}
                            </Typography>
                            <Button startIcon={<DeleteIcon />} size="small" variant='contained' onClick={() => window.confirm(`Are you sure you wish to delete ${friend.friend.username} as a friend?`) && clickDeleteFriend(friend)}>
                                Delete Friend
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

            ))}
        </Grid>
        <PendingFriendRequest />
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
        loadFriendshipData () {
            dispatch(getFriends())
            dispatch(getFriendsPendingReceived())
            dispatch(getFriendsPendingSent())
        }
    }
}

export default connect(mapState, mapDispatch)(AllFriends)