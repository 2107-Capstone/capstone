import React, { useState } from 'react'
import { Link } from 'react-router-dom'

//////// MENU BAR /////////////
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

////////// REDUX ////////////
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

/////////// MATERIAL UI /////////////
import { AppBar, Box, Button, Container, Divider, SvgIcon, Toolbar, Paper, Typography, useMediaQuery, Badge } from '@mui/material';

/////////// COMPONENTS ///////////////////
import MenuBar from './MenuBar';
import theme from '../../theme'

/////////// SVG //////////////////
import Logo from '/public/tripoutlogo.svg'

const Navbar = (props) => {
  const isLoggedIn = useSelector(state => !!state.auth.id)

  //////// MENU BAR /////////////
  const { drawerWidth, setMode } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  ///////// Check screen size for mobile //////////////////
  const notMobileSize = useMediaQuery(theme.breakpoints.up('sm'));
  const handleDrawerToggle = () => {
    if (notMobileSize) {
      setMobileOpen(false)
    }
    else {
      setMobileOpen(!mobileOpen);
    }
  };

  const user = useSelector(state => state.auth)
  const pendingInvites = useSelector(state => state.usertrips).filter(usertrip => usertrip.tripInvite === 'pending' && usertrip.userId === user.id)
  const userDebts = useSelector(state => state.userDebts).filter(userDebt => userDebt.status === 'pending' && (userDebt.payeeId === user.id || userDebt.payorId === user.id));

  const friendNotifications = useSelector(state => state.friendsPendingReceived).length || 0
  const tripInvitations = pendingInvites.length || 0
  const debtNotifications = userDebts.length || 0
  const countNotifications = friendNotifications + tripInvitations + debtNotifications

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='inherit' sx={{ boxShadow: 0 }}>
        <Toolbar>
          {isLoggedIn ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Button variant='outlined' color='inherit' component={Link} to="/home">
              Home
            </Button>
          )}
          <SvgIcon sx={{ fontSize: '4rem', flexGrow: 1, width: 'auto', my: .5 }} color='primary' viewBox="0 0 900 425">
            <Logo />
          </SvgIcon>
          {isLoggedIn ? (
            <IconButton component={Link} to='/notifications' sx={{ display: { sm: 'none' } }}>
              <Badge badgeContent={countNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          ) : (
            <Button variant='outlined' color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar >
      <Divider />
      {
        isLoggedIn && (
          <MenuBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}
            drawerWidth={drawerWidth} />
        )
      }
    </Box >
  )
}

export default Navbar
