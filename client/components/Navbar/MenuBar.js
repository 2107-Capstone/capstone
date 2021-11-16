import React from 'react'

/////////// REDUX //////////////////////
import { useDispatch } from 'react-redux';

/////////////// STORE /////////////////
import { logout } from '../../store';

///////////// MATERIAL UI ///////////////
import { Button, Box, Divider, Drawer, Stack, Toolbar } from '@mui/material'

//////////// ICONS //////////////////
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';


const MenuBar = (props) => {
    const { mobileOpen, handleDrawerToggle, drawerWidth } = props
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }

    const menuBarButtons = (
        <Box sx={{ px: 1 }}>
            <Toolbar>

            </Toolbar>
            <Divider />
            <Stack spacing={2}>
                <Button variant='contained' sx={{ mt: 2 }} startIcon={<DashboardIcon />}>
                    Dashboard
                </Button>
                <Button variant='contained' startIcon={<CardTravelIcon />}>
                    Trips
                </Button>
                <Button variant='contained' startIcon={<PeopleIcon />}>
                    Friends
                </Button>
                <Button variant='contained' startIcon={<LocationOnIcon />}>
                    Map
                </Button>
                <Button variant='contained' startIcon={<EventIcon />}>
                    Calendar
                </Button>
                <Divider />
                <Button variant='outlined' color='info' startIcon={<SettingsIcon />}>
                    Settings
                </Button>
                <Button variant='outlined' onClick={handleLogout}>
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

export default MenuBar