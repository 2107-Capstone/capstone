import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { connect } from 'react-redux'
import { getAdminUsers } from '../../store'

////////////// MATERIAL UI ///////////
import { Box, Grid, Paper, Typography, Avatar, AvatarGroup } from "@mui/material"
import PeopleIcon from '@mui/icons-material/People'
import CircularLoading from '../Loading/CircularLoading'


export const AdminAllUsers = ({ adminUsers, loadUserData }) => {
    const dispatch = useDispatch()
    useEffect(async () => {
        await dispatch(loadUserData())
    }, [])
    
    if (!adminUsers) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <PeopleIcon fontSize='medium' />
                    <Typography variant='h5'>
                        &nbsp;ALL USERS
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
                    &nbsp;ALL USERS
                </Typography>
            </Box>
            <Typography align='center'>
                {adminUsers.length === 0 ? "No users" : ""}
            </Typography>
            <Grid container spacing={2} sx={{ my: 4 }}>
                {adminUsers.map(adminUser => (
                    <Grid item xs={12} sm={4} md={3} key={adminUser.id}>
                        <Paper elevation={1}>
                            <Box sx={{ minHeight: 250, py: 1, color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }} src={adminUser.avatar}>
                                    {adminUser.firstName[0] + adminUser.lastName[0]}
                                </Avatar>
                                <Typography variant='h6'>
                                    {adminUser.username}
                                </Typography>
                                <Typography >
                                    First Name: {adminUser.firstName}
                                </Typography>
                                <Typography >
                                    Last Name: {adminUser.lastName}
                                </Typography>
                                <Typography >
                                    Email: {adminUser.email}
                                </Typography>
                                <Typography >
                                    Phone Number: {adminUser.phoneNumber}
                                </Typography>
                                <Box>
                                    <Typography >
                                        Friends:
                                    </Typography>
                                    {adminUser.userFriends.length === 0 ? 
                                    (<Typography >
                                        No friends
                                    </Typography>):
                                    (<AvatarGroup max={4}>
                                        {adminUser.userFriends.map(userFriend => (
                                            <Avatar sx={{ bgcolor: 'primary.main' }} src={userFriend.friend.avatar} key={userFriend.id}>
                                                {userFriend.friend.firstName[0] + userFriend.friend.lastName[0]}
                                            </Avatar>
                                        ))}
                                    </AvatarGroup>)
                                    }
                                </Box>
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
        adminUsers: state.adminUsers,
    }
}

const mapDispatch = (dispatch) => {
    return {
        loadUserData() {
            dispatch(getAdminUsers())
        }
    }
}

export default connect(mapState, mapDispatch)(AdminAllUsers)