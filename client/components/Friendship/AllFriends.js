import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'
import AddFriend from './AddFriend'
import PendingFriendRequestSent from './PendingFriendRequestSent'
import { deleteUserFriend, getFriends, getFriendsPendingReceived, getFriendsPendingSent } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Button, Grid, Paper, Typography, Snackbar, IconButton } from "@mui/material"
import PeopleIcon from '@mui/icons-material/People'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularLoading from '../Loading/CircularLoading'
import CloseIcon from '@mui/icons-material/Close'


export const AllFriends = ({friends, userFriends, deleteUserFriend, loadFriendshipData }) => {
    const clickDeleteFriend = async (friend) => {
        console.log(friend)
        const _userFriend = userFriends.find(userFriend => userFriend.userId === friend.friendId)
        await deleteUserFriend(friend.id)
        await deleteUserFriend(_userFriend.id)
        handleClick()
        handleClose()
        await loadFriendshipData()
        console.log(friend)
    }

    const [open, setOpen] = useState(false);
    const [friend, setFriend] = useState({});

    const handleClick = (friend) => {
        setOpen(true);
        setFriend(friend)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
        setFriend({})
    };

    // const action = (
    //     <Fragment>
    //     <Button color="secondary" size="small" onClick={clickDeleteFriend}>
    //     YES
    //     </Button>
    //     <Button color="secondary" size="small" onClick={handleClose}>
    //     NO
    //     </Button>
    //     <IconButton
    //         size="small"
    //         aria-label="close"
    //         color="inherit"
    //         onClick={handleClose}
    //     >
    //         <CloseIcon fontSize="small" />
    //     </IconButton>
    //     </Fragment>
    // );


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
                            <Button startIcon={<DeleteIcon />} size="small" variant='contained' onClick={() => handleClick(friend)}>
                                Delete Friend
                            </Button>
            
                        </Box>
                    </Paper>
                </Grid>
                
            ))}
        </Grid>
        <Snackbar 
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={friend && friend.friend ? `Are you sure you wish to delete ${friend.friend.username} as a friend?`:''}
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
        <PendingFriendRequestSent />
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