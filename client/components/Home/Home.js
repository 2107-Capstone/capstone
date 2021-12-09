import React from 'react'

///////////////////// UI ///////////////////////
import { Box, Grid, Typography } from '@mui/material'

const Home = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ height: '50vh', bgcolor: 'lightblue' }}>
          <Typography>
            Container 1
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ height: '40vh', bgcolor: 'pink' }}>
          <Typography>
            Container 2
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ height: '40vh', bgcolor: 'orange' }}>
          <Typography>
            Container 3
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ height: '40vh', bgcolor: 'yellow' }}>
          <Typography>
            Container 4
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ height: '40vh', bgcolor: 'lightgreen' }}>
          <Typography>
            Container 5
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home