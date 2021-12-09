import React, { useState } from "react"
import LockIcon from '@mui/icons-material/Lock';
import { authenticate } from "../../store";
import { useDispatch } from "react-redux";


///////////////// MATERIAL UI ////////////////////////
import { Box, Container, Avatar, Typography, Grid, TextField, Button, Link, SvgIcon } from '@mui/material';

///////////AIRPLANE LOGO //////////////
import LogoIcon from '/public/tripIcon.svg'

const SignupForm = () => {
    const dispatch = useDispatch()

    const [input, setinput] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    })

    const handleChange = (evt) => {
        const name = evt.target.name
        const value = evt.target.value

        setinput({ ...input, [name]: value })

    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        const userInfo = input
        try {
            dispatch(authenticate(userInfo, 'signup'))
        }
        catch (error) {

        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <SvgIcon color='primary' sx={{ fontSize: '5rem', my: 1 }} viewBox="0 0 272 264">
                    <LogoIcon />
                </SvgIcon>
                <Typography variant="body">
                    Welcome to Trip Out!
                </Typography>
                <Typography component="h1" variant="h5">
                    Sign up
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
                                value={input.firstName}
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
                                value={input.lastName}
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
                                value={input.username}
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
                                value={input.email}
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={input.password}
                                autoComplete="new-password"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="phoneNumber"
                                label="Phone Number"
                                value={input.phoneNumber}
                                id="phoneNumber"
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
                        Sign Up
                    </Button>
                    <Typography align='center'>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default SignupForm
