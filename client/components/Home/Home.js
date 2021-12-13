import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'

///////////////////// UI ///////////////////////
import { Box, Collapse, Fade, Zoom, Grid, Grow, IconButton, Slide, Typography, Divider, Button, Container } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/////////////// Data ////////////
import data from './data'
import { Link } from 'react-router-dom';

/////// Check if element is in view //////////////////
import InViewPort from './InViewPort';

const Home = () => {

  /////// Reference for arrow down icon //////////////////
  const scroll = useRef(null)
  const handleScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  const dataLen = data.length;
  const [reference, setreference] = useState([])
  // const reference = useRef([])

  // reference.current = Array(dataLen).fill('').map((_, idx) => reference.current[idx] = createRef())

  useEffect(() => {
    setreference(reference => (Array(dataLen).fill('').map((_, idx) => reference[idx] = createRef())
    ))
  }, [dataLen])

  
  const test = InViewPort(reference[0], "0px")
  // console.log(reference)
  // console.log(InViewPort(reference[0], "0px"))
  // console.log(InViewPort(reference[1], "0px"))
  // console.log(InViewPort(reference[5], "0px"))
  // console.log(scroll)
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '95vh', backgroundImage: `url('/images/road.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Grow in={true} timeout={1500}>
          <Box sx={{ border: 'solid white 5px', py: '2%', px: '10%', bgcolor: 'rgba(0, 0, 0, 0.5)' }}>
            <Typography align='center' variant='h2' color='white'>
              Welcome to <br />
              TRIP OUT!
            </Typography>
          </Box>
        </Grow>
        <Slide in={true} timeout={1200}>
          <IconButton sx={{ mt: 3, color: 'white', bgcolor: 'rgba(0, 0, 0, 0.5)' }} onClick={handleScroll}>
            <KeyboardArrowDownIcon sx={{ fontSize: 80 }} />
          </IconButton>
        </Slide>
      </Box>
      <Divider ref={scroll} variant='middle' sx={{ my: 5 }}>
        <Typography color='text.secondary' variant='h3' sx={{ fontSize: 80 }}>
          Functionalities
        </Typography>
      </Divider>
      <Grid container spacing={5} justifyContent='space-around'>
        {
          data.map((info, idx) => (
            <Slide in={true} direction="up" timeout={info.timeout} key={info.id}>
              <Grid item xs={12} md={6} >
                <Box ref={reference[idx]} sx={{ minHeight: 700, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', bgcolor: 'lightblue' }}>
                  <Box>
                    <Typography variant='h5' align='center'>
                      {info.title}
                    </Typography>
                    <Typography align='center' gutterBottom>
                      {info.description}
                    </Typography>
                  </Box>
                  <Box>
                    <img src={info.image} />
                  </Box>
                </Box>
              </Grid>
            </Slide>
          ))
        }
        <Grid item xs={12} md={6}>
          <Box sx={{
            minHeight: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'lightblue'
          }}>
            <Typography variant='h5' align='center'>
              Sign Up
            </Typography>
            <Typography align='center'>
              Are you ready to take your trip to the next level?
            </Typography>
            <Button variant='contained' component={Link} to='/signup'>
              Sign Up
            </Button>
          </Box>
        </Grid>
      </Grid >
      {/* </Container> */}
    </>
  )
}

export default Home

{/* <Grid item xs={12} md={6}>
<Box sx={{ height: '75vh', bgcolor: 'orange' }}>
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
</Grid> */}