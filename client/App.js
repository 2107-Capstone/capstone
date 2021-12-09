
import React from 'react'

//////////// MATERIAL UI ////////////////
import { CssBaseline } from '@mui/material'
import { Box } from '@mui/system'

/////////// COMPONENTS ///////////////////
import Navbar from './components/Navbar/Navbar'
import Routes from './Routes'
import Footer from './components/Footer/Footer'
import { useSelector } from 'react-redux'


const App = () => {

  const isLoggedIn = useSelector(state => state.auth.id)
  let menuBarWidth;

  if (!!isLoggedIn) {
    menuBarWidth = 250
  }
  else {
    menuBarWidth = 0
  }

  return (
    <Box sx={{
      minHeight: '100vh', position: 'relative', width: { sm: `calc(100% - ${menuBarWidth}px)` },
      ml: { sm: `${menuBarWidth}px` }
    }}>
      <CssBaseline />
      <Navbar drawerWidth={menuBarWidth} />
      <Box sx={{ pb: 18 }}>
        <Routes />
      </Box>
      <Footer />
    </Box>
  )
}

export default App
