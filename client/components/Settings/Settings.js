import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//////////// MUI //////////////////
import { Badge, Avatar, Box, Button, Container, IconButton, Grid, TextField, Typography, Alert as MuiAlert, Snackbar } from '@mui/material';
import { Edit as EditIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import MuiPhoneNumber from 'material-ui-phone-number';

////////////// REDUX ////////////////
import { updateUser, me } from '../../store'

const Settings = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth);

  const [input, setinput] = useState({
    username: auth.username || '',
    firstName: auth.firstName || '',
    lastName: auth.lastName || '',
    email: auth.email || '',
    phoneNumber: auth.phoneNumber || '',
    error: '',
    disabled: false,
    repeatInfoError: '',
  })

  const userDebts = useSelector((state) => state.userDebts);

  const handleChange = (evt) => {
    if (!evt.target) {
      const err = evt.length < 17 ? 'Phone number must have 10 digits.' : '';
      setinput({ ...input, phoneNumber: evt, disabled: evt.length < 17 ? true : false, error: err, repeatInfoError: '' })
    } else {
      const name = evt.target.name
      const value = evt.target.value

      setinput({ ...input, [name]: value, disabled: input.error ? true : false, repeatInfoError: '' })
    }
  }

  const handleSubmit = async (evt) => {
    // console.log(input)
    evt.preventDefault()
    try {
      await dispatch(updateUser({ id: auth.id, ...input }));
      await dispatch(me({ id: auth.id, ...input }));
      setOpenAlert(true)
    }
    catch (error) {
      // console.log(error)
      setinput({ ...input, repeatInfoError: 'Username or Email already exists' })

    }
  }
  //////////// SNACKBAR ALERT //////////////////
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
  });

  const [openAlert, setOpenAlert] = useState(false)
  const handleClose = () => {
    setOpenAlert(false);
  }



  const userAvatar =
    <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main' }} src={auth.avatar} >
      {auth.firstName[0] + auth.lastName[0]}
    </Avatar>

  return (
    <Container component="main" maxWidth="xs">

      <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Profile Updated!
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton component={Link} to='/settings/authavatar'>
          <Badge badgeContent={<EditIcon sx={{ fontSize: 15 }} />} color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} overlap="circular" >
            <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main' }} src={auth.avatar} >
              {auth.firstName[0] + auth.lastName[0]}
            </Avatar>
          </Badge>
        </IconButton>
        <Typography component="h1" variant="h5">
          {auth.username}'s Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={input.firstName || ''}
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={input.lastName || ''}
                autoComplete="family-name"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={input.username || ''}
                autoComplete="username"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                type='email'
                label="Email Address"
                name="email"
                value={input.email || ''}
                autoComplete="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPhoneNumber
                onlyCountries={['us']}
                defaultCountry={'us'}
                value={input.phoneNumber || ''}
                id="phoneNumber"
                onChange={handleChange}
                variant='outlined'
                fullWidth
                disableAreaCodes
                label='Phone Number'
              />
            </Grid>
            {
              input.error &&
              <Grid item xs={12}>
                <Typography variant='caption' sx={{ color: 'red' }}>
                  {input.error}
                </Typography>
              </Grid>
            }
            {
              input.repeatInfoError &&
              <Grid item xs={12}>
                <Typography variant='caption' sx={{ color: 'red' }}>
                  {input.repeatInfoError}
                </Typography>
              </Grid>
            }
            {/* <Grid item xs={12} >
                            <FormControl variant="outlined" fullWidth>
                              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-password"
                                type={input.showPassword ? 'text' : 'password'}
                                value={input.password || ''}
                                name="password"
                                onChange={handleChange}
                                autoComplete="current-password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {input.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label="Password"
                              />
                            </FormControl>
                        </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={input.disabled}
            sx={{ mt: 3, mb: 2 }}
          >
            Update Information
          </Button>
          <Button
            component={Link}
            to='/settings/password'
            variant='contained'
            fullWidth
            startIcon={<VpnKeyIcon />}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Settings;