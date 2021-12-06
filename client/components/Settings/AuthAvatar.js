import React, { Component } from "react";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { updateUser, me } from '../../store'
//////////// MUI //////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import SettingsIcon from '@mui/icons-material/Settings';
import Alert from '@mui/material/Alert';

class AuthAvatar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      avatar: '',
      open: false
    }
    this.save = this.save.bind(this)
    this.setOpen = this.setOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  async save (ev) {
    const { setOpen } = this
    ev.preventDefault()
    const { avatar } = this.state
    const { auth } = this.props
    const { updateUser, me } = this.props
    try {
      await updateUser({...auth, avatar: avatar });
      setOpen()
      await me(auth)
      this.setState({...this.state, avatar: ''})
    }
    catch (error) {
      console.log(error)
    }
  }

  setOpen () {
    this.setState({...this.state, open: true})
  }

  handleClose () {
    this.setState({...this.state, open: false})
  }
  
  componentDidMount () {
    this.el.addEventListener('change', (ev) => {
      const file = ev.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.setState({ avatar: reader.result })
      })
      reader.readAsDataURL(file)
    })

    let fileUpload = document.getElementById('fileUpload')
    let fileSizeLimit = document.getElementById('fileSizeLimit')
    
    fileUpload.addEventListener('change', () => {
      let files = fileUpload.files
      if (files.length > 0) {
        if (files[0].size > 5*1024*1024) {
          fileSizeLimit.innerText = 'File size cannot exceed 5MB'
          return
        }
      }
      fileSizeLimit.innerText = ''
    })
  }

  

  render () {
    const { avatar, open } = this.state
    const { auth } = this.props
    const { save, handleClose } = this
    let fileSizeLimit = document.getElementById('fileSizeLimit')
    
    return (
      <Container component="main" maxWidth="xs">
      <Button component={Link} to='/settings' variant='outlined' color='info' startIcon={<SettingsIcon />}>
        Back
      </Button>
      <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main'}} src={auth.avatar} >
        {auth.firstName[0]+auth.lastName[0]}
      </Avatar>
      {
        !!avatar && <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main'}} src={avatar} />
      }
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
      Avatar Changed!
      </Alert>
      </Snackbar>
      <Box component="form" onSubmit={save} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControl variant="outlined">
            <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 2 }}
                xs={12}
              >
                Upload File
                <input
                  id='fileUpload'
                  type="file"
                  hidden
                  ref={ el => this.el = el}
                  accept="image/*"
                />
              </Button>
              <span id='fileSizeLimit'></span>
              </FormControl>
            </Grid>
            <Button
              type="save"
              variant="contained"
              disabled={ !avatar || !!fileSizeLimit.innerText }
              sx={{ mt: 2, mb: 2 }}
              xs={12}
            >
                Save
            </Button>
        </Grid>
      </Box>
      </Container>
    )

  }
}

const mapState = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateUser: (user) => {
          dispatch(updateUser(user))
      },
    me: (auth) => {
      dispatch(me(auth))
    },
  }
}

export default connect(mapState, mapDispatch)(AuthAvatar)