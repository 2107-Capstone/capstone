import React, { useEffect, useRef } from 'react'

///////////////////// UI ///////////////////////
import { Box, Grid, Grow, IconButton, Slide, Typography, Divider, Button, Zoom, Collapse, Fade, Container } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/////////////// Data ////////////
import data from './data'
import { Link } from 'react-router-dom';

///////////  Background Shapes ////////////
import { overlappingCircles } from 'hero-patterns'

/////// Check if element is in view //////////////////
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react'

const Home = () => {
  const dataLen = data.length;
  const references = new Array(dataLen + 1).fill('').map(_ => useInView({
    triggerOnce: true,
  })
  )

  const user = useSelector(state => state.auth)

  const theme = useTheme()

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
      <Box ref={scroll} sx={{ background: overlappingCircles(theme.palette.success.main, .3), backgroundAttachment: 'fixed' }}>
        <Container maxWidth='xl'>
          <Grid container justifyContent='space-around'>
            {
              data.map((info, idx) => (
                <Zoom in={references[idx][1]} timeout={1200} key={info.id}>
                  <Grid item xs={12} md={6} >
                    <Box ref={references[idx][0]} sx={{ minHeight: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 10 }}>
                      <Box sx={{ maxWidth: 450, minHeight: 110 }}>
                        <Typography variant='h4' align='center' sx={{ textDecoration: 'underline' }}>
                          {info.title}
                        </Typography>
                        <Typography variant='h6' align='center'>
                          {info.description}
                        </Typography>
                      </Box>
                      <Box>
                        <img src={info.image} />
                      </Box>
                    </Box>
                  </Grid>
                </Zoom>
              ))
            }
            {!user.id && (
              <Zoom in={references[dataLen][1]} timeout={1200}>
                <Grid item xs={12} md={6} >
                  <Box ref={references[dataLen][0]} sx={{ minHeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: `solid 5px ${theme.palette.success.main}`, p: '10%' }}>
                      <Box>
                        <Typography variant='h3' align='center'>
                          Sign Up
                        </Typography>
                        <Typography variant='h5' align='center' gutterBottom>
                          Are you ready to take your trip to the next level?
                        </Typography>
                      </Box>
                      <Box>
                        <Button color='secondary' variant='contained' component={Link} to='/signup'>
                          Sign Up
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Zoom>
            )
            }
          </Grid >
        </Container>
      </Box>
    </>
  )
}

export default Home