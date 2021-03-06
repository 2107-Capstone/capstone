import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

/////////// REDUX //////////////////////
import { useDispatch } from 'react-redux';

/////////////// STORE /////////////////
import { logout } from '../../store';

///////////// MATERIAL UI ///////////////
import { Button, Box, Divider, Drawer, Stack, Toolbar, IconButton, Typography, Badge } from '@mui/material'

//////////// ICONS //////////////////
import { Home as HomeIcon, LocationOn as LocationOnIcon, CardTravel as CardTravelIcon, Event as EventIcon, People as PeopleIcon, Settings as SettingsIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

//////////////// REDUX //////////////////////
import { getUserTrips } from '../../store/usertrips';

const MenuBar = (props) => {
    const { mobileOpen, handleDrawerToggle, drawerWidth, setMode } = props
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            await dispatch(logout())
        } catch (error) {
            console.log(error)
        }
    }
    const user = useSelector(state => state.auth)
    const pendingInvites = useSelector(state => state.usertrips).filter(usertrip => usertrip.tripInvite === 'pending' && usertrip.userId === user.id) || []
    const userDebts = useSelector(state => state.userDebts).filter(userDebt => userDebt.status === 'pending' && (userDebt.payeeId === user.id || userDebt.payorId === user.id));

    useEffect(async () => {
        try {
            await dispatch(getUserTrips())
        } catch (error) {
            console.log(error)
        }
    }, [])

    const friendNotifications = props.friendsPendingReceived.length || 0
    const tripInvitations = pendingInvites.length || 0
    const debtNotifications = userDebts.length || 0
    const countNotifications = friendNotifications + tripInvitations + debtNotifications


    const menuBarButtons = (
        <Box sx={{ px: 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ my: 2.5, fontWeight: 'bold' }}>
                    Hello, {user.firstName}
                </Typography>
            </Toolbar>
            <Divider />
            <Stack spacing={2}>
                {
                    user.username === 'Admin' ?
                        '' :
                        <Button component={Link} onClick={handleDrawerToggle} to='/home' variant='contained' sx={{ mt: 2 }} startIcon={<HomeIcon />}>
                            Home
                        </Button>
                }
                {
                    user.username === 'Admin' ?
                        <Button component={Link} onClick={handleDrawerToggle} to='/admin/admintrips' variant='contained' sx={{ mt: 2 }} startIcon={<CardTravelIcon />}>
                            Trips (Admin)
                        </Button> :
                        <Button component={Link} onClick={handleDrawerToggle} to='/trips' variant='contained' startIcon={<CardTravelIcon />}>
                            Trips
                        </Button>
                }
                {
                    user.username === 'Admin' ?
                        <Button component={Link} onClick={handleDrawerToggle} to='/admin/adminusers' variant='contained' startIcon={<PeopleIcon />}>
                            Users (Admin)
                        </Button> :
                        <Button component={Link} onClick={handleDrawerToggle} to='/friends' variant='contained' startIcon={<PeopleIcon />}>
                            Friends
                        </Button>
                }
                {
                    user.username === 'Admin' ?
                        <Button component={Link} onClick={handleDrawerToggle} to='/admin/map' variant='contained' startIcon={<LocationOnIcon />}>
                            Map (Admin)
                        </Button> :
                        <Button component={Link} onClick={handleDrawerToggle} to='/map' variant='contained' startIcon={<LocationOnIcon />}>
                            Map
                        </Button>
                }
                {
                    user.username === 'Admin' ?
                        <Button component={Link} to='/admin/calendar' onClick={handleDrawerToggle} variant='contained' startIcon={<EventIcon />}>
                            Calendar (Admin)
                        </Button> :
                        <Button component={Link} to='/calendar' onClick={handleDrawerToggle} variant='contained' startIcon={<EventIcon />}>
                            Calendar
                        </Button>
                }
                {
                    user.username === 'Admin' ?
                        '' :
                        <Button component={Link} to='/notifications' onClick={handleDrawerToggle} variant='contained' startIcon={<Badge badgeContent={countNotifications} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'left' }}><NotificationsIcon /></Badge>}>
                            Notifications
                        </Button>
                }
                <Divider />
                {
                    user.username === 'Admin' ?
                        '' :
                        <Button component={Link} to='/settings' onClick={handleDrawerToggle} variant='outlined' color='info' startIcon={<SettingsIcon />}>
                            Profile
                        </Button>
                }
                <Button onClick={handleDrawerToggle} variant='outlined' onClick={handleLogout}>
                    Logout
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="menu bar"
        >
            <Drawer
                // container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {menuBarButtons}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {menuBarButtons}
            </Drawer>
        </Box>
    )
}

const mapState = state => {
    return {
        friendsPendingReceived: state.friendsPendingReceived
        //add pending trip requests received
    }
}

export default connect(mapState)(MenuBar)