import { CssBaseline } from '@mui/material'
import React from 'react'

import Navbar from './components/Navbar/Navbar'
import Routes from './Routes'

const App = () => {
  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
