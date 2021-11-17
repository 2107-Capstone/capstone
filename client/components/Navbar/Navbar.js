import React, { useState } from 'react'
import { Link } from 'react-router-dom'

//////// MENU BAR /////////////
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


////////// REDUX ////////////
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

/////////// MATERIAL UI /////////////
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import MenuBar from './MenuBar';

const Navbar = (props) => {

  const isLoggedIn = useSelector(state => !!state.auth.id)

  //////// MENU BAR /////////////
  const { drawerWidth } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='inherit'>
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
          <Typography align='center' color="inherit" variant="h5" sx={{ flexGrow: 1 }}>
            TRIP OUT
          </Typography>
          {!isLoggedIn && (
            <Button variant='outlined' color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar >
      {isLoggedIn && (
        <MenuBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth} />
      )}
    </Box >
  )
}

export default Navbar
