import React from 'react'
import { Link } from 'react-router-dom'

/////////////// MUI /////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import CardTravelIcon from '@mui/icons-material/CardTravel';

import { parseISO, format } from 'date-fns';

export const AdminTripTitle = ({trip, type}) => {
    
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
                            &nbsp;{trip.name}
                            </Typography>
                                {
                                    trip.isOpen ? "" :
                                    <Typography variant='h6' display='inline' color='text.secondary'>
                                        &nbsp;{'(Closed)'}
                                    </Typography>
                                }
                        </Box>
                        <Typography variant='subtitle2' color='text.secondary'>
                            {format(parseISO(trip.startTime), 'P')} to {format(parseISO(trip.endTime), 'P')}
                        </Typography>
                    </Box>
                    :
                    <Box
                        className='linkToTrip' 
                        component={Link} 
                        to={`/admin/admintrips/${trip.id}`}
                        sx={{textDecoration: 'none'}}
                    >
                        <Box display='flex' flexDirection='column' alignItems='center'>
                            <Box display='flex' alignItems='center'>
                                <Typography variant='h4' color='text.primary'>
                                &nbsp;{trip.name}
                                </Typography>
                                    {
                                        trip.isOpen ? "" :
                                        <Typography variant='h6' display='inline' color='text.secondary'>
                                            &nbsp;{'(Closed)'}
                                        </Typography>
                                    }
                            </Box>
                            <Typography variant='subtitle2' color='text.secondary'>
                                {format(parseISO(trip.startTime), 'P')} to {format(parseISO(trip.endTime), 'P')}
                            </Typography>
                        </Box>
                    </Box>
                }
        </Box>
        
        </>
    )
}

export default AdminTripTitle