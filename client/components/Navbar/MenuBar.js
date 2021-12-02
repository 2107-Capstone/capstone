import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

/////////// REDUX //////////////////////
import { useDispatch } from 'react-redux';

/////////////// STORE /////////////////
import { logout } from '../../store';

///////////// MATERIAL UI ///////////////
import { Button, Box, Divider, Drawer, Stack, Toolbar, IconButton, Typography } from '@mui/material'

//////////// ICONS //////////////////
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';


const MenuBar = (props) => {
    const { mobileOpen, handleDrawerToggle, drawerWidth } = props
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }

    const menuBarButtons = (
        <Box sx={{ px: 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton component={Link} to='/home' color='primary' onClick={handleDrawerToggle}>
                    <FlightTakeoffIcon sx={{ fontSize: 45 }} />
                </IconButton>
            </Toolbar>
            <Divider />
            <Stack spacing={2}>
                <Button component={Link} onClick={handleDrawerToggle} to='/dashboard' variant='contained' sx={{ mt: 2 }} startIcon={<DashboardIcon />}>
                    Dashboard
                </Button>
                <Button component={Link} onClick={handleDrawerToggle} to='/trips' variant='contained' startIcon={<CardTravelIcon />}>
                    Trips
                </Button>
                <Button component={Link} onClick={handleDrawerToggle} to='/friends' variant='contained' startIcon={<PeopleIcon />}>
                    Friends
                </Button>
                <Button component={Link} onClick={handleDrawerToggle} to='/map' variant='contained' startIcon={<LocationOnIcon />}>
                    Map
                </Button>
                <Button component={Link} to='/calendar' onClick={handleDrawerToggle} variant='contained' startIcon={<EventIcon />}>
                    Calendar
                </Button>
                <Button component={Link} to='/notifications' onClick={handleDrawerToggle} variant='contained' startIcon={<EventIcon />}>
                    Notifications {props.friendsPendingReceived.length === 0? '':`(${props.friendsPendingReceived.length})`}
                </Button>
                <Divider />
                <Divider />
                <Button onClick={handleDrawerToggle} variant='outlined' color='info' startIcon={<SettingsIcon />}>
                    Settings
                </Button>
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