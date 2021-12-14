import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { updateUser, me, authenticate } from '../../store'

const Password = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const auth = useSelector((state) => state.auth);
    
    const [input, setinput] = useState({
        password: '',
        newPassword: '',
        newPasswordCheck: '',
        showPassword: false,
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

    const handleChange = (evt) => {
      const name = evt.target.name
      const value = evt.target.value
      setinput({ ...input, [name]: value })
        
    }

    const [oldPasswordCorrect, setOldPasswordCorrect] = useState(false);

    const handleSubmitOldPassword = async (evt) => {
      evt.preventDefault()
      const userInfo = { username: auth.username, password: input.password }
      try {
        await dispatch(authenticate(userInfo, 'login', 'passwordChange'))
        setinput(() => ({ ...input, password: '' }))
        setOldPasswordCorrect(() => true)
      } catch (err) {
        console.log(err)
      }
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        try {
          await dispatch(updateUser({...input, id: auth.id, password: input.newPassword }));
          await dispatch(me({...input, id: auth.id, password: input.newPassword}));
          setOldPasswordCorrect(() => false)
          setOpenAlert(true)
          //  history.push('/settings')
        }
        catch (error) {
          console.log(error)
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

    return (
        <Container component="main" maxWidth="xs">
          <Button component={Link} to='/settings' variant='outlined' startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
                  Password Changed!
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
                <Avatar sx={{ height: 60, width: 60, m: 1, bgcolor: 'primary.main' }}>
                    <VpnKeyIcon fontSize='large' />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Change Your Password
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} >
                                <FormControl variant="outlined" fullWidth>
                                  <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                  <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={input.showPassword ? 'text' : 'password'}
                                    value={input.newPassword || ''}
                                    name="newPassword"
                                    onChange={handleChange}
                                    autoComplete="new-password"
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
                                    label="New Password"
                                  />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl variant="outlined" fullWidth>
                                  <InputLabel htmlFor="outlined-adornment-password">Please Enter New Password Again</InputLabel>
                                  <OutlinedInput
                                    id="outlined-adornment-password-2"
                                    type={input.showPassword ? 'text' : 'password'}
                                    value={input.newPasswordCheck|| ''}
                                    name="newPasswordCheck"
                                    onChange={handleChange}
                                    autoComplete="new-password-check"
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
                                    label="Please Enter New Password Again"
                                  />
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={input.newPassword !== input.newPasswordCheck}
                        >
                            Update Password
                        </Button>
                        {
                          input.newPassword !== input.newPasswordCheck ?
                            <Typography sx={{color: 'red'}} variation='caption'>
                              New passwords must match!
                            </Typography>
                            : ''
                        }
                    </Box>
                {/* {
                  oldPasswordCorrect ? '' : 
                    <Box component="form" onSubmit={handleSubmitOldPassword} sx={{ mt: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} >
                              
                                <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Current Password"
                                type="password"
                                id="password"
                                value={input.password}
                                autoComplete="password"
                                onChange={handleChange}
                                />
                                
                              
                            </Grid>
                        </Grid>
                        
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                    </Box>
                } */}
                {/* {
                  oldPasswordCorrect ? (
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} >
                                <FormControl variant="outlined" fullWidth>
                                  <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                  <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={input.showPassword ? 'text' : 'password'}
                                    value={input.newPassword || ''}
                                    name="newPassword"
                                    onChange={handleChange}
                                    autoComplete="new-password"
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
                                    label="New Password"
                                  />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl variant="outlined" fullWidth>
                                  <InputLabel htmlFor="outlined-adornment-password">Please Enter New Password Again</InputLabel>
                                  <OutlinedInput
                                    id="outlined-adornment-password-2"
                                    type={input.showPassword ? 'text' : 'password'}
                                    value={input.newPasswordCheck|| ''}
                                    name="newPasswordCheck"
                                    onChange={handleChange}
                                    autoComplete="new-password-check"
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
                                    label="Please Enter New Password Again"
                                  />
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={input.newPassword !== input.newPasswordCheck}
                        >
                            Update Password
                        </Button>
                        {
                          input.newPassword !== input.newPasswordCheck ?
                            <Typography sx={{color: 'red'}} variation='caption'>
                              New passwords must match!
                            </Typography>
                            : ''
                        }
                    </Box>
                  )
                  : ''
                } */}
            </Box>
        </Container>
    )
}

export default Password;