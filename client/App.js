import React from 'react'

//////////// MATERIAL UI ////////////////
import { CssBaseline } from '@mui/material'
import { Box } from '@mui/system'

/////////// COMPONENTS ///////////////////
import Navbar from './components/Navbar/Navbar'
import Routes from './Routes'
import Footer from './components/Footer/Footer'

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <CssBaseline />
      <Navbar />
      <Box sx={{ pb: 18 }}>
        <Routes />
      </Box>
      <Footer />
    </Box>
  )
}

export default App
