import React from 'react'
import { Link } from 'react-router-dom'

/////////////// MUI /////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import CardTravelIcon from '@mui/icons-material/CardTravel';

import { parseISO, format } from 'date-fns';

export const TripTitle = ({trip, type}) => {
    
    return (
        <>
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems:'flex-start', 
                mb: 1,
                mt: 1 }}
        >
                <CardTravelIcon fontSize='large'/>
                {
                    type === 'main' ?
                    <Box display='flex' flexDirection='column' alignItems='center'>
                        <Box display='flex' alignItems='center'>
                            <Typography variant='h4'>
                            &nbsp;{trip.trip.name}
                            </Typography>
                                {
                                    trip.trip.isOpen ? "" :
                                    <Typography variant='h6' display='inline' color='text.secondary'>
                                        &nbsp;{'(Closed)'}
                                    </Typography>
                                }
                        </Box>
                        <Typography variant='subtitle2' color='text.secondary'>
                            {format(parseISO(trip.trip.startTime), 'P')} to {format(parseISO(trip.trip.endTime), 'P')}
                        </Typography>
                    </Box>
                    :
                    <Box
                        className='linkToTrip' 
                        component={Link} 
                        to={`/trips/${trip.tripId}`}
                        sx={{textDecoration: 'none'}}
                    >
                        <Box display='flex' flexDirection='column' alignItems='center'>
                            <Box display='flex' alignItems='center'>
                                <Typography variant='h4' color='text.primary'>
                                &nbsp;{trip.trip.name}
                                </Typography>
                                    {
                                        trip.trip.isOpen ? "" :
                                        <Typography variant='h6' display='inline' color='text.secondary'>
                                            &nbsp;{'(Closed)'}
                                        </Typography>
                                    }
                            </Box>
                            <Typography variant='subtitle2' color='text.secondary'>
                                {format(parseISO(trip.trip.startTime), 'P')} to {format(parseISO(trip.trip.endTime), 'P')}
                            </Typography>
                        </Box>
                    </Box>
                }
        </Box>
        
        </>
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

export const Users = ({users}) => {
    return (
        <Box display='flex' justifyContent='center' flexWrap='wrap'>
            {
                users.map(user => (
                    <Box key={user.id} marginRight={1} display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center' alignItems='center'
                        sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}
                    >
                        <Avatar
                            sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main' }}
                            src={user.avatar}
                        >
                            {user.firstName[0] + user.lastName[0]}
                        </Avatar>
                        <Typography variant='caption'>
                            {user.username}
                        </Typography>
                    </Box>
                ))
            }
        </Box>
    )
}