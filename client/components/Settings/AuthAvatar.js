import React, { Component } from "react";
import { connect } from 'react-redux'
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateUser, me, authenticate } from '../../store'
//////////// MUI //////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import MuiPhoneNumber from 'material-ui-phone-number';
import SettingsIcon from '@mui/icons-material/Settings';
import Input from '@mui/material/Input';
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
  }

  render () {
    const { avatar, open } = this.state
    const { auth } = this.props
    const { save, handleClose } = this

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
                  type="file"
                  hidden
                  ref={ el => this.el = el}
                />
              </Button>
              </FormControl>
            </Grid>
            <Button
              type="save"
              variant="contained"
              disabled={!avatar}
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

//     return (
//         <Container component="main" maxWidth="xs">
//           <Button component={Link} to='/settings' variant='outlined' color='info' startIcon={<SettingsIcon />}>
//             Back
//           </Button>
//           <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main'}} src={auth.avatar} >
//             {auth.firstName[0]+auth.lastName[0]}
//           </Avatar>
//           <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//               <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
//                   Avatar Changed!
//               </Alert>
//           </Snackbar>
//           <Typography component="h1" variant="h5">
//               Edit Your Avatar
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit}
//           sx={{
//               marginTop: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//           }}>
//           <Grid container spacing={1}>
//             <Grid item xs={12}>
//               <FormControl variant="outlined" fullWidth>
//               <Button
//                 variant="contained"
//                 component="label"
//               >
//                 Upload File
//                 <input
//                   type="file"
//                   hidden
//                   onChange={handleChange}
//                   ref={el => el = el}
//                 />
//               </Button>
//                 <TextField
//                     required
//                     fullWidth
//                     id="authAvatar"
//                     label="Upload"
//                     name="authAvatar"
//                     value={input.authAvatar || ''}
//                     autoComplete="authAvatar"
//                     onChange={handleChange}
//                 />
//               </FormControl>
//             </Grid>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={input.disabled}
//               sx={{ mt: 3, mb: 2 }}
//             >
//                 Update Avatar
//             </Button>
//           </Grid>
//           </Box> 
//         </Container>
//     )
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