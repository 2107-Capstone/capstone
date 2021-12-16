import React, { useState } from "react"
import { useDispatch, connect } from "react-redux";

/////////// Material UI /////////////////
import { Box, Avatar, TextField, Typography, Button, Link, Container, SvgIcon, } from '@mui/material';

///////////// REDUX STORE ///////////////
import { authenticate } from "../../store";

///////////AIRPLANE LOGO //////////////
import LogoIcon from '/public/tripIcon.svg'

const LoginForm = ({ error }) => {
    const dispatch = useDispatch()
    const [input, setinput] = useState({
        username: '',
        password: '',

    })

    const handleChange = (evt) => {
        const name = evt.target.name
        const value = evt.target.value

        setinput({ ...input, [name]: value })
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        const userInfo = input
        if (input.username === 'Admin') {
            dispatch(authenticate(userInfo, 'login', 'admin'))
        } else {
            dispatch(authenticate(userInfo, 'login'))
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    mt: 8,
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
                <Typography component='h1' variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={input.username}
                        autoComplete="username"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={input.password}
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    {error && error.response && (
                        <Typography align='center' sx={{ color: 'red' }}>
                            {error.response.data}
                        </Typography>
                    )}
                    <Typography align='center'>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container >
    )
}

const mapState = (state) => {
    return {
        error: state.auth.error,
    }
}

export default connect(mapState)(LoginForm)
