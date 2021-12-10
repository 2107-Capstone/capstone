import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

/////////////// STORE /////////////////
import { closeTrip, getAdminTrips, addUserDebt } from '../../store'

/////////////// COMPONENTS /////////////////
import CircularLoading from '../Loading/CircularLoading'
import PieChart from '../Expenses/PieChart'
import EventsTable from '../Events/EventsTable'
import MessagesTable from '../Chat/MessagesTable'

/////////////// MUI /////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ChatIcon from '@mui/icons-material/Chat';
import DateRangeIcon from '@mui/icons-material/DateRange';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/People'

import { format, formatISO, parseISO, isAfter, isBefore } from "date-fns";
import theme from '../../theme'

import { settleUp } from '../Expenses/SettleUp'

const AdminTrip = (props) => {
    const id = props.match.params.id

    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getAdminTrips())
    }, [])

    const { auth, categories } = useSelector(state => state);

    const trip = useSelector(state => state.adminTrips.find(adminTrip => adminTrip.id === id));
    let events = useSelector(state => state.adminEvents.filter(adminEvent => adminEvent.tripId === id));
    let messages = useSelector(state => state.adminMessages.filter(adminMessage => adminMessage.tripId === id));

    const tripExpenses = useSelector(state => state.adminExpenses.filter(adminExpense => adminExpense.tripId === id));
    const totalExpenses = tripExpenses.reduce((total, expense) => {
        return total + +expense.amount
    }, 0);
    
    if (!trip || !events || !messages || !tripExpenses) {
        return <CircularLoading />
    }
    
    const users = trip.userTrips;
        
    events = events.sort((a, b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    events.length > 5 ? events.length = 5 : ''


    messages = messages.sort((a, b) => isBefore(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    messages.length > 5 ? messages.length = 5 : ''
    messages = messages.sort((a, b) => isAfter(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignSelf: 'center', margin: 2, marginBottom: 0 }}>
                            <CardTravelIcon fontSize='medium' />
                            <Typography variant='h5'>
                                &nbsp;{trip.name}
                                {
                                    trip.isOpen ? "" :
                                        " (Trip Closed)"
                                }
                            </Typography>
                        </Box>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Typography >
                                Trip Creator: {trip.user.username}
                            </Typography>
                            <Avatar sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main' }} src={trip.user.avatar} >
                                {trip.user.firstName[0] + trip.user.lastName[0]}
                            </Avatar>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2} marginBottom={2}>
                <Grid item xs={12} sm={12} md={2} lg={2}>
                    <Button
                        className='tripButton'
                        style={styles.tripButton}
                        component={Link} to={`${trip.id}/chat`}
                        startIcon={<ChatIcon />}
                        size='medium'
                        color='secondary'
                        variant='contained'
                    >
                        CHAT
                    </Button>
                </Grid>
                <Grid item xs sm md lg>
                    <Button
                        component={Link} to={`${trip.id}/calendar`}
                        size='medium'
                        startIcon={<DateRangeIcon />}
                        color='secondary'
                        variant='contained'
                    >
                        CALENDAR
                    </Button>
                </Grid>
                <Grid item xs sm md lg>
                    <Button
                        component={Link} to={`${trip.tripId}/map`}
                        size='medium'
                        startIcon={<MapIcon />}
                        color='secondary'
                        variant='contained'
                    >
                        MAP
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <PeopleIcon fontSize='medium' />
                        <Typography variant='h6'>
                            &nbsp;Trip Friends
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='center'>
                        {
                            trip.userTrips.map(user => (
                                <Box key={user.userId} marginRight={1} display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center' alignItems='center'
                                    sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}
                                >
                                    <Avatar
                                        sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main' }}
                                        src={user.user.avatar}
                                    >
                                        {user.user.firstName[0] + user.user.lastName[0]}
                                    </Avatar>
                                    <Typography variant='caption'>
                                        {user.user.username}
                                    </Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex' }}>
                        <Box >
                            <Button sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }} component={Link} to={`${trip.id}/expenses`} variant='outlined' startIcon={<OpenInNewIcon />} style={{ color: 'white', }}>
                                Details
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <PaidIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Expenses Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mx: 1, mb: 2 }}>

                        <Typography>
                            Total Expenses: ${totalExpenses.toFixed(2)}
                        </Typography>
                        {
                            tripExpenses.length !== 0 ?
                                <PieChart expenses={tripExpenses} users={users} categories={categories} /> :
                                <Typography>
                                    No expenses yet.
                                </Typography>
                        }
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box bgcolor="primary.main" sx={{ display: 'flex' }}>
                        <Box style={styles.headingIcon}>
                            <ChatIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Recent Messages
                            </Typography>
                        </Box>
                    </Box>
                    <MessagesTable messages={messages} />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box bgcolor="primary.main" sx={{ display: 'flex' }}>
                        <Box style={styles.headingIcon}>
                            <DateRangeIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Upcoming Events
                            </Typography>
                        </Box>
                    </Box>
                    <EventsTable events={events} />
                </Grid>
            </Grid>
        </div>
    )
}
export default AdminTrip;

const styles = {
    headingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        flexGrow: 1,
        color: 'white'
    },

}