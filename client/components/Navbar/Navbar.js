import React, { useState } from 'react'
import { Link } from 'react-router-dom'

//////// MENU BAR /////////////
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


////////// REDUX ////////////
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

/////////// MATERIAL UI /////////////
import { AppBar, Box, Button, Container, Divider, SvgIcon, Toolbar, Paper, Typography, useMediaQuery } from '@mui/material';
// import { AppBar, Box, Button, Divider, Icon, SvgIcon, Toolbar, Typography, useMediaQuery } from '@mui/material';


import MenuBar from './MenuBar';
import theme from '../../theme'

import PinIcon from '/public/tripoutlogo.svg'
const pin = 'pin-0.svg'

const Navbar = (props) => {
  const isLoggedIn = useSelector(state => !!state.auth.id)

  //////// MENU BAR /////////////
  const { drawerWidth } = props;
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
          {/* <img src={pin} /> */}
          <SvgIcon sx={{ fontSize: '4rem', width: 'auto', flexGrow: 1 }} color='inherit' viewBox="0 0 1100 520">
            <PinIcon />
          </SvgIcon>
          {/* <Container sx={{ px: 1, textAlign: 'center' }}>
            <img src={theme.palette.mode === 'light' ? "/images/logo.png" : "/images/logo-dark-wide.png"} style={{ maxHeight: '3rem', }} />
          </Container> */}
          {/* <Typography align='center' color="inherit" variant="h5" sx={{ flexGrow: 1 }}>
            TRIP OUT!
          </Typography> */}
          {!isLoggedIn && (
            <Button variant='outlined' color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar >
      <Divider />
      {isLoggedIn && (
        <MenuBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth} />
      )}
    </Box >
  )
}

export default Navbar
