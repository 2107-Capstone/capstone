import React from 'react'

/////////////// MUI /////////////////
import { Avatar, Box, Typography } from '@mui/material';

const UserAvatar = ({ user }) => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
        >
            <Avatar
                sx={{ height: 35, width: 35, m: 1, mb: 0, bgcolor: 'primary.main' }}
                src={user.avatar}
            >
                {user.firstName[0] + user.lastName[0]}
            </Avatar>
            <Typography variant='caption'>
                {user.username}
            </Typography >
        </Box>
    )
}
export default UserAvatar