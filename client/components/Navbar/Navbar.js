import React from 'react'
import { Link } from 'react-router-dom'

////////// REDUX ////////////
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

///////// STORE /////////////
import { logout } from '../../store'

/////////// MATERIAL UI /////////////
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => !!state.auth.id)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography color="inherit" component={Link} to="/home" variant="h5" sx={{ flexGrow: 1 }}>
            TRIP OUT
          </Typography>
          {isLoggedIn ? (
            <Button variant='outlined' color="inherit" onClick={handleLogout}>
              Logout
            </Button>

          ) : (
            <Stack direction="row" spacing={2}>
              <Button variant='outlined' color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button variant='outlined' color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar >
    </Box >
  )
}

export default Navbar
