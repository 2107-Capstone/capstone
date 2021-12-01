import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import MuiPhoneNumber from 'material-ui-phone-number';

import { updateUser, me } from '../../store'

const Settings = () => {
    
    const auth = useSelector((state) => state.auth);
    
    const dispatch = useDispatch()

    const [input, setinput] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        showPassword: false,
        disabled: false,
        error: '',
    })

    const handleClickShowPassword = () => {
      setinput({
        ...input,
        showPassword: !input.showPassword,
      });
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    useEffect(() => {
      setinput({
        username: auth.username,
        password: auth.password,
        firstName: auth.firstName,
        lastName: auth.lastName,
        email: auth.email,
        phoneNumber: auth.phoneNumber,
      })
    }, [])

    const handleChange = (evt) => {
      console.log(evt)
        if (!evt.target) {
          setinput({ ...input, phoneNumber: evt, disabled: evt.length < 3 ? true : false })
        } else {
          const name = evt.target.name
          const value = evt.target.value
          setinput({ ...input, [name]: value, disabled: value === '' ? true : false })
        }
    }

    const handleSubmit = async (evt) => {
      console.log(input)
        evt.preventDefault()
        try {
           await dispatch(updateUser({id: auth.id, ...input}));
           await dispatch(me({id: auth.id, ...input}));
           setOpenAlert(true)
        }
        catch (error) {
          console.log(error)
        }
    }
    
    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
    });

    const [openAlert, setOpenAlert] = useState(false)
    const handleClose = () => {
      setOpenAlert(false);
    }

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
                <Button>Location Settings</Button>
                <Button>Upload Avatar</Button>
                <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main' }}>
                    <FlightTakeoffIcon fontSize='large' />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {auth.username}'s Profile
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                                label="Email Address"
                                name="email"
                                value={input.email || ''}
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                          <MuiPhoneNumber 
                            countryCodeEditable='false'
                            defaultCountry={'us'} 
                            value={input.phoneNumber || ''}
                            id="phoneNumber" 
                            onChange={handleChange} 
                            variant='outlined' 
                            fullWidth 
                            label='Phone Number'
                          />  
                        </Grid>
                        <Grid item xs={12} >
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
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={input.disabled}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default Settings;