import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CircularLoading from '../Loading/CircularLoading'
import TripMap from '../Map/TripMap'
import { Participants, Events } from './tripInfo'
import Expenses from '../Expenses/Expenses'
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Box, Grid, Button, Paper, TextField, Tooltip, Typography, Dialog } from '@mui/material'
import ChatRoom from '../Chat/ChatRoom'
import CardTravelIcon from '@mui/icons-material/CardTravel';
const Trip = (props) => {

    const id = + props.match.params.id

    const auth = useSelector(state => state.auth);


    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));
    // console.log(trip)
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
        <>
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
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {trip.trip.userTrips.map(user => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={user.id}>
                        <Paper style={{width: 150, height: 80}} sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}>
                            <Box>
                                insert photo?
                            </Box>
                            <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    {user.user.username}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                ))}
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>     
                <Grid item xs={12} sm={6} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                    <Link to={`${trip.tripId}/expenses`} >
                        <Button variant='contained'>
                            Expenses Details
                        </Button>
                    </Link>
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
                <Grid item xs={12} sm={6} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                    insert calendar?
                    {/* <Participants trip={trip} auth={auth} /> */}
                </Grid>
                <Grid item xs={12} sm={6} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                    <Link to={`${trip.tripId}/chat`} >
                        <Button variant='contained'>
                            Full Screen
                        </Button>
                    </Link>
                    <ChatRoom trip={trip}/>
                </Grid>
                <Grid item xs={12} sm={6} sx={{border: '1px solid grey', borderRadius: '10px'}}>
                    REDESIGN THIS
                    <TripMap tripId={id} users={trip.trip.userTrips}/>
                </Grid>
                {/* <Grid item xs={12} sm={6} key={trip.id} >
                    <Paper sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                        
                    </Paper>
                </Grid> */}
            </Grid>
                {/* <Button component={Link} to={`/trip/${trip.tripId}/chat`} variant='contained' color='error' startIcon={<TextsmsIcon />}>
                    Trip Chat
                </Button> */}
            {/* </Tooltip> */}
            {/* <h3>Friends in Trip</h3>
            <Participants trip={trip} auth={auth} />
            <h3>Events in Trip</h3>
            <Events tripId={id} />
            <h3>Expenses in Trip</h3>
            <Expenses tripId={id} trip={trip} />
            <TripMap tripId={id} users={trip.trip.userTrips}/> */}
        </>
    )
}
export default Trip;