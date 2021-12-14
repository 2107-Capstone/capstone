import React, { useEffect, useRef } from 'react'

///////////////////// UI ///////////////////////
import { Box, Grid, Grow, IconButton, Slide, Typography, Divider, Button, Zoom, Collapse, Fade } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/////////////// Data ////////////
import data from './data'
import { Link } from 'react-router-dom';

///////////  Background Shapes ////////////
import { overlappingCircles } from 'hero-patterns'

/////// Check if element is in view //////////////////
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';

const Home = () => {
  const dataLen = data.length;
  const references = new Array(dataLen + 1).fill('').map(_ => useInView({
    triggerOnce: true,
    // threshold: 1
  })
  )

  const user = useSelector(state => state.auth)

  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
  }, [])

  /////// Reference for arrow down icon //////////////////
  const scroll = useRef(null)
  const handleScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

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
      <Grid container justifyContent='space-around' sx={{ background: overlappingCircles('#a2cf6e', .3), backgroundAttachment: 'fixed' }}>
        {
          data.map((info, idx) => (
            <Zoom in={references[idx][1]} timeout={1200} key={info.id}>
              <Grid item xs={12} md={6} >
                <Box ref={references[idx][0]} sx={{ minHeight: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                  <Box>
                    <Typography variant='h5' align='center'>
                      {info.title}
                    </Typography>
                    <Typography align='center' gutterBottom>
                      {info.description}
                    </Typography>
                  </Box>
                  <Box>
                    <img src={info.image} height={530} />
                  </Box>
                </Box>
              </Grid>
            </Zoom>
          ))
        }
        {!user.id && (
          <Zoom in={references[dataLen][1]} timeout={1200}>
            <Grid item xs={12} md={6} >
              <Box ref={references[dataLen][0]} sx={{ minHeight: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                <Box>
                  <Typography variant='h5' align='center'>
                    Sign Up
                  </Typography>
                  <Typography align='center' gutterBottom>
                    Are you ready to take your trip to the next level?
                  </Typography>
                </Box>
                <Box>
                  <Button color='secondary' variant='contained' component={Link} to='/signup'>
                    Sign Up
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Zoom>
        )
        }
      </Grid >
    </>
  )
}

export default Home