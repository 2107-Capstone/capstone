import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CircularLoading from '../Loading/CircularLoading'
import TripMap from '../Map/TripMap'
import { Participants, Events } from './tripInfo'
import Expenses from '../Expenses/Expenses'
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Box, Divider, Grid, Button, Paper, TextField, Tooltip, Typography, Dialog } from '@mui/material'
import ChatRoom from '../Chat/ChatRoom'
import CardTravelIcon from '@mui/icons-material/CardTravel';
import PeopleIcon from '@mui/icons-material/People'
import PaidIcon from '@mui/icons-material/Paid';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChatIcon from '@mui/icons-material/Chat';
import MapIcon from '@mui/icons-material/Map';
import Avatar from '@mui/material/Avatar';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FaBlackberry } from 'react-icons/fa'
import SingleTripCalendar from '../Calendar/SingleTripCalendar'

const Trip = (props) => {

    const id = + props.match.params.id

    const auth = useSelector(state => state.auth);


    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));


    //     if (!trip) return '...loading'
    //TODO: why does    trip = trip.trip    not allow refresh?
    // console.log('TRIPPPPPPPPPPPPP', trip)           
    const tripExpenses = useSelector(state => state.expenses.filter(expense => expense.tripId === id));
    const totalExpenses = tripExpenses.reduce((total, expense) => {
        return total + +expense.amount
    }, 0);
    const userTotal = tripExpenses.reduce((total, expense) => {
        if (expense.paidById === auth.id) {
            total += +expense.amount
        }
        return total;
    }, 0);

    if (!trip) return <CircularLoading />
    
    const users = trip.trip.userTrips;
    
    return (

        <div>
        {/* <Button
  variant="contained"
  component="label"
>
  Upload File
  <input
    type="file"
    hidden
  />
</Button> */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Typography variant='h5'>
                    &nbsp;{trip.trip.name}
                </Typography>
            </Box>
            <Box id='singleTrip' sx={{display: 'flex', justifyContent: 'space-around', alignContent: 'space-between'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 1, alignContent: 'center', marginRight: '1rem', border: '1px solid grey', borderRadius: '10px',}}>
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <Box style={styles.headingIcon}>
                                <PeopleIcon fontSize='medium' />
                                <Typography variant='subtitle1'>
                                    &nbsp;Trip Friends
                                </Typography>
                            </Box>
                                <Button>Add Friend to Trip</Button>
                        </Grid>
                        <Divider sx={{border: '2px solid black'}}/>
                        {trip.trip.userTrips.map(user => (
                            <Grid item xs={12}  key={user.id}>
                                <Paper  sx={{ margin: '1rem', height: 'fit-content', ':hover': { boxShadow: (theme) => theme.shadows[5] } }}>
                                    <Box sx={{alignItems: 'center'}}>
                                        <Avatar alt={user.user.username} src="https://cdn3.iconfinder.com/data/icons/avatars-flat/33/man_5-512.png" />
                                    </Box>
                                    <Box sx={{ color: 'inherit', alignItems: 'center'}}>
                                        <Typography variant='h6'>
                                            {user.user.username}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box display='flex' flexDirection='column' width='100%' sx={{mr: 1}}>
                    <Grid container sx={{ mt: 1 }}>     
                        <Grid item xs={12}  sx={{border: '1px solid grey', borderRadius: '10px'}}>
                            <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                                <Box >
                                    <Button component={Link} to={`${trip.tripId}/expenses`} size='large' color='info' startIcon={<OpenInNewIcon />} className='headingButton' style={styles.headingButton}>
                                    </Button>
                                </Box>
                                <Box style={styles.headingIcon}>
                                    <PaidIcon fontSize='medium' />
                                    <Typography variant='h6'>
                                        &nbsp;Expenses
                                    </Typography>
                                </Box>
                            </Box>
                            ADD 'ADD EXPENSE' BUTTON?
                            <Typography>
                                Total Expenses: ${totalExpenses.toFixed(2)}
                            </Typography>
                            <Typography>
                                Each Person Owes: ${(totalExpenses/users.length).toFixed(2)}
                            </Typography>
                            <Typography>
                                You've Paid: ${userTotal.toFixed(2)}
                            </Typography>
                            {/* <Expenses tripId={id} trip={trip} /> */}
                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 1 }}>  
                        <Grid item xs={12} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                            <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                                <Box >
                                    <Button component={Link} to={`${trip.tripId}/calendar`} size='large' color='info' startIcon={<OpenInNewIcon />} className='headingButton'  style={styles.headingButton}>
                                    </Button>
                                </Box>
                                <Box style={styles.headingIcon}>
                                    <DateRangeIcon fontSize='medium' />
                                    <Typography variant='h6'>
                                        &nbsp;Calendar
                                    </Typography>
                                </Box>
                            </Box>
                            <SingleTripCalendar trip={trip.trip}/>
                            {/* <Participants trip={trip} auth={auth} /> */}
                        </Grid>
                    </Grid>
                </Box>
                <Box display='flex' flexDirection='column' sx={{width: '500px'}}>
                    <Grid container  sx={{ margin: 1}}>    
                        <Grid item xs={12} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                            <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                                <Box >
                                    <Button component={Link} to={`${trip.tripId}/chat`} size='large' color='info' startIcon={<OpenInNewIcon />} className='headingButton' style={styles.headingButton}>
                                    </Button>
                                </Box>
                                <Box style={styles.headingIcon}>
                                    <ChatIcon fontSize='medium' />
                                    <Typography variant='h6'>
                                        &nbsp;Chat
                                    </Typography>
                                </Box>
                            </Box>
                            <ChatRoom trip={trip}/>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ margin: 1 }}>  
                        <Grid item xs={12} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                            <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                                <Box >
                                    <Button component={Link} to={`${trip.tripId}/map`} size='large' color='info' startIcon={<OpenInNewIcon />} className='headingButton' style={styles.headingButton}>
                                    </Button>
                                </Box>
                                <Box style={styles.headingIcon}>
                                    <MapIcon fontSize='medium' />
                                    <Typography variant='h6'>
                                        &nbsp;Map
                                    </Typography>
                                </Box>
                            </Box>
                            
                            REDESIGN THIS
                            <TripMap tripId={id} users={trip.trip.userTrips}/>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    )
}
export default Trip;

const styles = {
    headingButton: {
      margin: 0,
      color: 'black',
    },
    headingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'cornsilk',
        flexGrow: 1,
    },
  
  }