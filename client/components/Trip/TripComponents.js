import React from 'react'
import { Link } from 'react-router-dom'


/////////////// MUI /////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import CardTravelIcon from '@mui/icons-material/CardTravel';

export const TripTitle = ({trip, type}) => {
    
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                mb: 1,
                mt: 1 }}
        >
                <CardTravelIcon fontSize='medium' />
                {
                    type === 'main' ?
                        <Typography variant='h4'>
                        &nbsp;{trip.trip.name}
                            {
                                trip.trip.isOpen ? "" :
                                    " (Closed)"
                            }
                        </Typography>
                    :
                        <Box
                            className='linkToTrip' 
                            sx={{ color: 'inherit' }} 
                            component={Link} 
                            to={`/trips/${trip.tripId}`}
                        >
                            <Typography variant='h4'>
                                &nbsp;{trip.trip.name}
                                {
                                    trip.trip.isOpen ? "" :
                                        " (Closed)"
                                }
                            </Typography>
                        </Box>
                }
            </Box>
    )
}

export const UserAvatar = ({user}) => {
    return (
        <Box 
            display='flex' 
            flexDirection='column' 
            justifyContent='center' 
            alignItems='center'
        >
            <Avatar 
                sx={{ height: 35, width: 35, m: 1, mb: 0 }}
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