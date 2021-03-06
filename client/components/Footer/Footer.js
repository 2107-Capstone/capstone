import React from 'react'

////////////////// MATERIAL UI ////////////////
import { Box, Grid, IconButton, Typography, Link } from '@mui/material';
import { GitHub as GitHubIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';

const Footer = () => {
    const Copyright = () => {
        return (
            <Typography variant="body2" color="text.secondary">
                {'Copyright © '}
                <Link color="inherit" href="https://github.com/2107-Capstone/capstone.git" target="_blank">
                    Trip Out
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    return (
        <Box
            component="footer"
            sx={{
                position: 'absolute',
                bottom: 0,
                height: 'auto',
                width: '100%',
                // borderTop: 'solid 1px black'
            }}
        >
            <Grid container justifyContent="space-around" alignItems='center'>
                <Grid item>
                    <Typography variant="body1" align='center' sx={{ textDecoration: 'underline' }}>
                        Developers
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="body1">
                            <IconButton size="small" href="https://github.com/andygao1990" target="_blank">
                                <AccountCircleIcon />
                            </IconButton>
                            Andy
                        </Typography>
                        <Typography variant="body1">
                            <IconButton size="small" href="https://github.com/nightsandwich" target="_blank">
                                <AccountCircleIcon />
                            </IconButton>
                            Corinne
                        </Typography>
                        <Typography variant="body1">
                            <IconButton size="small" href="https://github.com/jmartin-code" target="_blank">
                                <AccountCircleIcon />
                            </IconButton>
                            Jonathan
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Typography align='center'>
                        <IconButton href="https://github.com/2107-Capstone/capstone.git" target="_blank">
                            <GitHubIcon />
                        </IconButton>
                    </Typography>
                    <Copyright />
                    <Typography align='center' variant="body2" color="text.secondary">
                        FullStack Academy
                    </Typography>
                </Grid>
            </Grid>
        </Box >
    )
}

export default Footer