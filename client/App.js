
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"

//////////// MATERIAL UI ////////////////
import { CssBaseline } from '@mui/material'
import { Box } from '@mui/system'

/////////// COMPONENTS ///////////////////
import Navbar from './components/Navbar/Navbar'
import Routes from './Routes'
import Footer from './components/Footer/Footer'

///////////// WS ////////////////////
window.socket = new WebSocket(window.location.origin.replace('http', 'ws') + '/ws');

const App = () => {
  const dispatch = useDispatch()

  const isLoggedIn = useSelector(state => !!state.auth.id)

  let menuBarWidth;

  if (isLoggedIn) {
    menuBarWidth = 250
  }
  else {
    menuBarWidth = 0
  }

  useEffect(() => {
    window.socket.addEventListener('message', ev => {
      const message = ev.data;
      const action = JSON.parse(message);
      console.log('action', action)
      dispatch(action)
    })
  }, [])

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
