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
import TripDebts from '../Expenses/TripDebts'
import ExpensesTable from '../Expenses/ExpensesTable'
import Summary from '../Trip/Components/Summary'
import AdminTripTitle from './AdminTripTitle'
/////////////// MUI /////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip'
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

const AdminTrip = (props) => {
    const id = props.match.params.id

    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getAdminTrips())
    }, [])

    const trip = useSelector(state => state.adminTrips.find(adminTrip => adminTrip.id === id));
    let events = useSelector(state => state.adminEvents.filter(adminEvent => adminEvent.tripId === id));
    let messages = useSelector(state => state.adminMessages.filter(adminMessage => adminMessage.tripId === id));

    const tripExpenses = useSelector(state => state.adminExpenses.filter(adminExpense => adminExpense.tripId === id));
    
    if (!trip || !events || !messages || !tripExpenses) {
        return <CircularLoading />
    }
    
    const users = trip.userTrips;

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                        <AdminTripTitle trip={trip} type={'main'} />
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Typography >
                                Trip Creator:
                            </Typography>
                            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                <Avatar sx={{ height: 35, width: 35, m: 1, mb: 0, bgcolor: 'primary.main' }} src={trip.user.avatar} >
                                    {trip.user.firstName[0] + trip.user.lastName[0]}
                                </Avatar>
                                <Typography variant='caption'>
                                    {trip.user.username}
                                </Typography >
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-evenly' flexWrap='wrap' sx={{mb: 2, mt: 2}}>
                <Button
                    component={Link} to={`${trip.id}/chat`}
                    startIcon={<ChatIcon />}
                    size='medium'
                    color='secondary'
                    variant='contained'
                >
                    CHAT
                </Button>
                <Button
                    component={Link} to={`${trip.id}/calendar`}
                    startIcon={<DateRangeIcon />}
                    size='medium'
                    color='secondary'
                    variant='contained'
                >
                    CALENDAR
                </Button>
                <Button
                    component={Link} to={`${trip.id}/map`}
                    startIcon={<MapIcon />}
                    size='medium'
                    color='secondary'
                    variant='contained'
                >
                    MAP
                </Button>
            </Box>
            <Grid container spacing={2}>
                {
                    !trip.isOpen &&
                    <Summary
                        trip={trip}
                        type={'Debt Summary'}
                        summaryTable={<TripDebts trip={trip} type={'admin'}/>}
                        icon={<PaidIcon fontSize='medium' />}
                    />
                }
                <Summary
                    trip={trip}
                    type={'messages'}
                    link={`${trip.id}/chat`}
                    length={messages.length}
                    summaryTable={<MessagesTable messages={messages} type={'admin'}/>}
                    tooltipMessage={'Last five messages'}
                    icon={<ChatIcon fontSize='medium' />}
                />
                <Summary
                    trip={trip}
                    type={'events'}
                    link={`${trip.id}/calendar`}
                    length={events.length}
                    summaryTable={<EventsTable events={events} />}
                    tooltipMessage={'Next five events'}
                    icon={<DateRangeIcon fontSize='medium' />}
                />
                <Summary
                    trip={trip}
                    type={'expenses'}
                    link={`${trip.id}/expenses`}
                    length={tripExpenses.length}
                    tooltipMessage={'Last five paid expenses'}
                    icon={<PaidIcon fontSize='medium' />}
                    summaryTable={<ExpensesTable expenses={tripExpenses} numUsers={users.length} />}
                />
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <PeopleIcon fontSize='medium' />
                        <Typography variant='h6'>
                            &nbsp;Trip Friends
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='center' flexWrap='wrap'>
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
        color: 'white',
        borderRadius: 7
    },
    debtHeadingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
        flexGrow: 1,
        color: 'white',
        borderRadius: 7
    },

}
{/* <Grid item xs={12} sm={12} md={6} lg={6} >
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
</Grid> */}