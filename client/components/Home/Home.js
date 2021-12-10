import React, { useRef } from 'react'

///////////////////// UI ///////////////////////
import { Box, Collapse, Fade, Grid, Grow, IconButton, Slide, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Home = () => {

  const scroll = useRef(null)
  const handleScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '95vh', backgroundImage: `url('/images/road.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <Grow in={true} timeout={1500}>
            <Box sx={{ border: 'solid white 5px', py: '2%', px: '10%', bgcolor: 'rgba(0, 0, 0, 0.5)' }}>
              <Typography align='center' variant='h2' color='white'>
                Welcome to <br />
                TRIP OUT!
              </Typography>
            </Box>
          </Grow>
          <Slide in={true} timeout={1500}>
            <IconButton sx={{ mt: 3, color: 'white', bgcolor: 'rgba(0, 0, 0, 0.5)' }} onClick={handleScroll}>
              <KeyboardArrowDownIcon sx={{ fontSize: 80 }} />
            </IconButton>
          </Slide>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} ref={scroll}>
        <Box sx={{ height: '50vh', bgcolor: 'pink' }}>
          <Typography variant='h5' align='center'>
            Organize Trips
          </Typography>
          <Typography align='center'>
            Create and organize trips with friends and family.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'orange' }}>
          <Typography variant='h5' align='center'>
            Add Events
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'yellow' }}>
          <Typography variant='h5' align='center'>
            Invite Friends
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'lightgreen' }}>
          <Typography variant='h5' align='center'>
            View Trip Map
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'green' }}>
          <Typography variant='h5' align='center'>
            Add Trip Expenses
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'silver' }}>
          <Typography variant='h5' align='center'>
            View Trip Calendar
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'green' }}>
          <Typography variant='h5' align='center'>
            Trip Chat Room
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: '50vh', bgcolor: 'green' }}>
          <Typography variant='h5' align='center'>
            Sign Up
          </Typography>
          <Typography align='center'>
            Are you ready to take your trip to the next level? 
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home