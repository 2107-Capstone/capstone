import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

/////////////// STORE /////////////////
import { editTrip, getTrips, addUserDebt } from '../../store'

/////////////// COMPONENTS /////////////////
import CircularLoading from '../Loading/CircularLoading'
import PieChart from '../Expenses/PieChart'
import EventForm from '../Map/EventForm'
import EventsTable from '../Events/EventsTable'
import ExpensesTable from '../Expenses/ExpensesTable'
import AddExpense from '../Expenses/AddExpense'
import MessagesTable from '../Chat/MessagesTable'
import InviteToTrip from './Form/InviteToTrip'
import TripDebts from '../Expenses/TripDebts'
import TripSpeedDial from './TripSpeedDial'
import AddTripForm from '../Trips/Form/AddTripForm'
/////////////// MUI /////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ChatIcon from '@mui/icons-material/Chat';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MapIcon from '@mui/icons-material/Map';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import WorkOffOutlinedIcon from '@mui/icons-material/WorkOffOutlined';

import { format, formatISO, parseISO, isAfter, isBefore } from "date-fns";
import theme from '../../theme'

import { settleUp } from '../Expenses/SettleUp'

const Trip = (props) => {
    const id = props.match.params.id

    const dispatch = useDispatch();
    
    const { auth, categories } = useSelector(state => state);
    
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));
    const events = useSelector(state => state.events.filter(event => event.tripId === id));
    const messages = useSelector(state => state.messages.filter(message => message.tripId === id));
    const expenses = useSelector(state => state.expenses.filter(expense => expense.tripId === id));

    useEffect(async () => {
        await dispatch(getTrips())
    }, [])
    
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState('');
    const handleClose = () => {
        setOpen(false);
        setForm('')
    }
    
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    
    if (!trip || !events || !messages || !expenses) {
        return <CircularLoading />
    }
    
    const users = trip.trip.userTrips;
    const tripDebts = trip.trip.userDebts;
    
    const handleCloseTrip = async () => {
        try {
            await dispatch(editTrip({ ...trip}))
            const debts = settleUp(expenses, users)
            if (debts) {
                debts.forEach(async(debt) => {
                    await dispatch(addUserDebt({ tripId: trip.tripId, payeeId: debt[1], payorId: debt[0], amount: +debt[2], status: 'pending'}))
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    const totalExpenses = expenses.reduce((total, expense) => {
        return total + +expense.amount
    }, 0);
    const eachPersonOwes = totalExpenses / users.length;
    let recentExpenses = expenses.sort((a, b) => isBefore(new Date(a.datePaid), new Date(b.datePaid)) ? 1 : -1);
    recentExpenses.length > 5 ? recentExpenses.length = 5 : ''
    recentExpenses = recentExpenses.sort((a,b) => isAfter(new Date(a.datePaid), new Date(b.datePaid)) ? 1 : -1);

    let recentEvents = events.sort((a, b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    recentEvents.length > 5 ? recentEvents.length = 5 : ''


    let recentMessages = messages.sort((a, b) => isBefore(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    recentMessages.length > 5 ? recentMessages.length = 5 : ''
    recentMessages = recentMessages.sort((a, b) => isAfter(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);

    return (
        <div>
            <Dialog fullWidth maxWidth="md" open={form === 'invitefriend' && open} onClose={handleClose}>
                <InviteToTrip handleClose={handleClose} />
            </Dialog>
            <Dialog open={form === 'expense' && open} onClose={handleClose}>
                <AddExpense trip={trip} handleClose={handleClose} />
            </Dialog>
            <Dialog open={form === 'event' && open} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} />
            </Dialog>
            <Dialog open={form === 'trip' && open} onClose={handleClose}>
                <AddTripForm trip={trip} handleClose={handleClose} />
            </Dialog>
            {
                trip.trip.isOpen ? 
                    <Box sx={{marginBottom: -10, position: 'sticky', top: 5, right: 5, zIndex: 1}}>
                        <TripSpeedDial handleCloseMenu={handleCloseMenu} setOpen={setOpen} setForm={setForm}/>
                    </Box>
                : ''
            }
            <Grid container rowSpacing={2} columnSpacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignSelf: 'center', margin: 2, marginBottom: 0 }}>
                            <CardTravelIcon fontSize='medium' />
                            <Typography variant='h5'>
                                &nbsp;{trip.trip.name}
                                {
                                    trip.trip.isOpen ? "" :
                                        " (Closed)"
                                }
                            </Typography>
                        </Box>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Typography >
                                Trip Creator:
                            </Typography>
                            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                <Avatar sx={{ height: 35, width: 35, m: 1, mb: 0 }} src={trip.trip.user.avatar} >
                                    {trip.trip.user.firstName[0] + trip.trip.user.lastName[0]}
                                </Avatar>
                                <Typography variant='caption'>
                                    {trip.trip.user.username}
                                </Typography >
                            </Box>
                            <Box>
                                {
                                    trip.trip.isOpen ? 
                                        <>
                                        <Tooltip 
                                            title={trip.trip.user.id !== auth.id ? `Only ${trip.trip.user.username} can close this trip` : ''}
                                            placement='top'
                                            enterNextDelay={100}
                                            enterTouchDelay={300}
                                            leaveTouchDelay={1000}
                                        >
                                            <Box sx={{ml: 2, mb: 1}}>
                                                <Button size='small' startIcon={<WorkOffOutlinedIcon />} variant='outlined' onClick={handleCloseTrip} disabled={trip.trip.user.id !== auth.id}>
                                                    Close Trip
                                                </Button>
                                            </Box>
                                        </Tooltip>
                                        <Tooltip 
                                            title={trip.trip.user.id !== auth.id ? `Only ${trip.trip.user.username} can edit this trip` : ''}
                                            placement='top'
                                            enterNextDelay={100}
                                            enterTouchDelay={300}
                                            leaveTouchDelay={1000}
                                        >
                                            <Box sx={{ml: 2}}>
                                                <Button size='small' startIcon={<ModeEditIcon />} variant='outlined' onClick={() => {
                                                    setForm('trip');
                                                    setOpen(true)
                                                }} 
                                                disabled={trip.trip.user.id !== auth.id}
                                                >
                                                    Edit Trip
                                                </Button>
                                            </Box>
                                        </Tooltip>
                                        </>
                                    : ''
                                }
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-evenly' flexWrap='wrap' sx={{mb: 2, mt: 2}}>
                <Button
                    component={Link} to={`${trip.tripId}/chat`}
                    startIcon={<ChatIcon />}
                    size='medium'
                    color='secondary'
                    variant='contained'
                >
                    CHAT
                </Button>
                <Button
                    component={Link} to={`${trip.tripId}/calendar`}
                    startIcon={<DateRangeIcon />}
                    size='medium'
                    color='secondary'
                    variant='contained'
                >
                    CALENDAR
                </Button>
                <Button
                    component={Link} to={`${trip.tripId}/map`}
                    startIcon={<MapIcon />}
                    size='medium'
                    color='secondary'
                    variant='contained'
                >
                    MAP
                </Button>
            </Box>
            {/* <Grid container spacing={1} marginBottom={2}>
                <Box display='flex' justifyContent='space-evenly'>
                    <Grid item xs={4}  sm={4}>
                        <Button
                            component={Link} to={`${trip.tripId}/chat`}
                            startIcon={<ChatIcon />}
                            size='small'
                            color='secondary'
                            variant='contained'
                        >
                            CHAT
                        </Button>
                    </Grid>
                    <Grid item xs={4}  sm={4}>
                        <Button
                            component={Link} to={`${trip.tripId}/calendar`}
                            startIcon={<DateRangeIcon />}
                            size='small'
                            color='secondary'
                            variant='contained'
                        >
                            CALENDAR
                        </Button>
                    </Grid>
                    <Grid item xs={4}  sm={4}>
                        <Button
                            component={Link} to={`${trip.tripId}/map`}
                            startIcon={<MapIcon />}
                            size='small'
                            color='secondary'
                            variant='contained'
                        >
                            MAP
                        </Button>
                    </Grid>
                    <Grid item xs sm md lg>
                        <Box >
                            
                            <Button
                                aria-expanded={openMenu ? 'true' : undefined}
                                variant="contained"
                                onClick={handleClick}
                                disabled={!trip.trip.isOpen}
                                endIcon={<KeyboardArrowDownIcon />}
                                size='medium'
                            >
                                EDIT TRIP
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem>
                                    <Button size='small' startIcon={<AddIcon />} variant='contained' onClick={() => {
                                        handleCloseMenu();
                                        setOpen(true);
                                        setForm('event')
                                    }} >
                                        Add Event
                                    </Button>
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem>
                                    <Button size='small' startIcon={<AddIcon />} variant='contained' onClick={() => {
                                        handleCloseMenu();
                                        setOpen(true);
                                        setForm('expense')
                                    }} >
                                        Add Expense
                                    </Button>
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem>
                                    <Button size='small' startIcon={<AddIcon />} variant='contained' onClick={() => {
                                        handleCloseMenu();
                                        setOpen(true);
                                        setForm('invitefriend')
                                    }} >
                                        Invite Friend
                                    </Button>
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />

                                <MenuItem>
                                    {
                                        trip.trip.userId === auth.id ?
                                            <Button size='small' startIcon={<AssignmentTurnedInIcon />} variant='contained' onClick={handleCloseTrip} >
                                                Mark Trip as Closed
                                            </Button>
                                            : 
                                            <Tooltip
                                                title={`Only ${trip.trip.user.username} can close this trip`}
                                                placement='top'
                                                enterNextDelay={100}
                                                enterTouchDelay={300}
                                                leaveTouchDelay={1000}
                                            >
                                                <Box>
                                                    <Button disabled size='small' startIcon={<AssignmentTurnedInIcon />} variant='contained'>
                                                        Mark Trip as Closed
                                                    </Button>
                                                </Box>
                                            </Tooltip>
                                    }
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                            </Menu>
                        </Box>
                    </Grid>
                </Box>
            </Grid> */}

            <Grid container spacing={2}>
                {
                    !trip.trip.isOpen ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box style={styles.debtHeadingIcon} sx={{ display: 'flex'}}>
                                <Box style={styles.debtHeadingIcon}>
                                    <PaidIcon fontSize='medium' />
                                    <Typography variant='h6'>
                                        &nbsp;Debt Summary
                                    </Typography>
                                </Box>
                            </Box>
                            {
                                tripDebts.length !== 0 ?
                                    <Box>
                                        <TripDebts tripDebts={tripDebts}/>
                                    </Box>
                                    :
                                    <Typography>
                                        No one in this trip owes money.
                                    </Typography>
                            }
                        </Grid>
                    : ''
                }
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex' }}>
                        <Box >
                            <Button sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }} component={Link} to={`${trip.tripId}/chat`} variant='outlined' startIcon={<OpenInNewIcon />} style={{ color: 'white', }}>
                                Details
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <ChatIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Messages Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    {
                        messages.length !== 0 ?
                            <Tooltip 
                                title='Last five messages' 
                                placement='top'
                                enterNextDelay={100}
                                enterTouchDelay={300}
                                leaveTouchDelay={500}
                            >
                                <Box>
                                    <MessagesTable messages={recentMessages} />
                                </Box>
                            </Tooltip>
                            :
                            <Typography>
                                No messages yet.
                            </Typography>
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex' }}>
                        <Box >
                            <Button sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }} component={Link} to={`${trip.tripId}/calendar`} variant='outlined' startIcon={<OpenInNewIcon />} style={{ color: 'white', }}>
                                Details
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <DateRangeIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Events Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    {
                        events.length !== 0 ?
                        <Tooltip 
                            title='Next five events' 
                            placement='top'
                            enterNextDelay={100}
                            enterTouchDelay={300}
                            leaveTouchDelay={500}
                        >
                                <Box>
                                    <EventsTable events={recentEvents} />
                                </Box>
                            </Tooltip>
                            :
                            <Typography>
                                No events yet.
                            </Typography>
                    }
                </Grid>
                
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex' }}>
                        <Box >
                            <Button sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }} component={Link} to={`${trip.tripId}/expenses`} variant='outlined' startIcon={<OpenInNewIcon />} style={{ color: 'white', }}>
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
                            {
                                expenses.length !== 0 ?
                                <Tooltip 
                                    title='Last five paid expenses' 
                                    placement='top'
                                    enterNextDelay={100}
                                    enterTouchDelay={300}
                                    leaveTouchDelay={500}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mx: 1, mb: 2 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, mb: 2, textAlign: 'center' }}>
                                            <Typography variant='subtitle2'>
                                                Total Expenses: ${totalExpenses.toFixed(2)}
                                            </Typography>
                                            <Typography variant='subtitle2'>
                                                Each Person Owes: ${eachPersonOwes.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <ExpensesTable expenses={recentExpenses} />
                                    </Box>
                                </Tooltip>
                                    :
                                    <Typography>
                                        No expenses yet.
                                    </Typography>
                            }
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.headingIcon} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <PeopleIcon fontSize='medium' />
                        <Typography variant='h6'>
                            &nbsp;Trip Friends
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='center' flexWrap='wrap'>
                        {
                            trip.trip.userTrips.map(user => (
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
export default Trip;

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