import React, { useState } from "react"
import { useDispatch } from "react-redux";

/////////// Material UI /////////////////
import { Box, Avatar, TextField, Typography, Button, Link, Container, } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

///////////// REDUX STORE ///////////////
import { authenticate } from "../../store";

const LoginForm = () => {
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
        dispatch(authenticate(userInfo, 'login'))
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
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

export default LoginForm
