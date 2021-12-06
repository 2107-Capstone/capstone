import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

/////////////// STORE /////////////////
import { closeTrip } from '../../store'

/////////////// COMPONENTS /////////////////
import CircularLoading from '../Loading/CircularLoading'
import PieChart from '../Expenses/PieChart'
import EventForm from '../Map/EventForm'
import EventsTable from '../Events/EventsTable'
import AddExpense from '../Expenses/AddExpense'
import MessagesTable from '../Chat/MessagesTable'
import InviteToTrip from './Form/InviteToTrip'

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
import { styled, alpha } from '@mui/material/styles';

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

const Trip = (props) => {
    const dispatch = useDispatch();
    const id = props.match.params.id

    const { auth, categories } = useSelector(state => state);

    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));
    let events = useSelector(state => state.events.filter(event => event.tripId === id));
    let messages = useSelector(state => state.messages.filter(message => message.tripId === id));
    
    const tripExpenses = useSelector(state => state.expenses.filter(expense => expense.tripId === id));
    const totalExpenses = tripExpenses.reduce((total, expense) => {
        return total + +expense.amount
    }, 0);
    
    const users = trip.trip.userTrips;

    if (!trip || !events || !messages || !tripExpenses || !users) {
        return <CircularLoading />
    }
    
    const handleCloseTrip = async () => {
        try {
            console.log(trip)
            await dispatch(closeTrip({ ...trip }))
        } catch (error) {
            console.log(error)
        }
    }


    // let events = trip.trip.events.sort((a,b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    events = events.sort((a, b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    events.length > 5 ? events.length = 5 : ''


    // let messages = trip.trip.messages.sort((a,b) => isAfter(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    // messages = trip.trip.messages.sort((a,b) => isAfter(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    messages = messages.sort((a, b) => isBefore(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    messages.length > 5 ? messages.length = 5 : ''
    messages = messages.sort((a,b) => isAfter(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState('');

    const handleClose = () => {
        setOpen(false);
        setForm('')
    }

    const StyledMenu = styled((props) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    
    return (
        <div>
            {/* <InviteToTrip /> */}
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
            <Dialog fullWidth open={form === 'invitefriend' && open} onClose={handleClose}>
                <InviteToTrip handleClose={handleClose} />
            </Dialog>
            <Dialog open={form === 'expense' && open} onClose={handleClose}>
                <AddExpense trip={trip} handleClose={handleClose} />
            </Dialog>
            <Dialog open={form === 'event' && open} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} />
            </Dialog>
            <Grid container rowSpacing={2} columnSpacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignSelf: 'center', margin: 2, marginBottom: 0 }}>
                            <CardTravelIcon fontSize='medium' />
                            <Typography variant='h5'>
                                &nbsp;{trip.trip.name} 
                                {
                                    trip.trip.isOpen ? "" :
                                        " (Trip Closed)"
                                }
                            </Typography>
                        </Box>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Typography >
                                Trip Creator: {trip.trip.user.username}
                            </Typography>
                            <Avatar sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} src={trip.trip.user.avatar} >
                                {trip.trip.user.firstName[0]+trip.trip.user.lastName[0]}
                            </Avatar>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} >
                        <Box style={{display: 'flex', flexDirection: 'row', justifyContent:'space-around', alignItems: 'center'}} >
                            {/* <Box display='flex' flexDirection='column'> */}
                                
                            <Button 
                                component={Link} to={`${trip.tripId}/chat`} 
                                size='medium' 
                                startIcon={<ChatIcon />} 
                                color='secondary'
                                variant='contained'
                                >
                                Group Chat
                            </Button>
                            <Button 
                                component={Link} to={`${trip.tripId}/calendar`} 
                                size='medium' 
                                startIcon={<DateRangeIcon />} 
                                color='secondary'
                                variant='contained'
                                >
                                TRIP CALENDAR
                            </Button>
                            <Button 
                                component={Link} to={`${trip.tripId}/map`}  
                                size='medium'  
                                startIcon={<MapIcon />} 
                                color='secondary'
                                variant='contained'
                            >
                                TRIP MAP
                            </Button>
                                
                            {/* </Box> */}
                            
                            <Box style={{alignSelf: 'right'}}>
                                <Button
                                    id="demo-customized-button"
                                    aria-controls="demo-customized-menu"
                                    aria-haspopup="true"
                                    aria-expanded={openMenu ? 'true' : undefined}
                                    variant="contained"
                                    disableElevation
                                    onClick={handleClick}
                                    disabled={!trip.trip.isOpen}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    size='medium'
                                >
                                    EDIT TRIP
                                </Button>
                                <StyledMenu
                                    id="demo-customized-menu"
                                    MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                            >
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem onClick={handleCloseMenu} disableRipple>
                                    EVENTS
                                </MenuItem>
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

                                    <MenuItem onClick={handleCloseMenu} disableRipple>
                                        EXPENSES
                                    </MenuItem>
                                    <MenuItem>
                                        <Button size='small' startIcon={<AddIcon />} variant='contained'  onClick={() => {
                                            handleCloseMenu();
                                            setOpen(true);
                                            setForm('expense')
                                        }} >
                                            Add Expense
                                        </Button>
                                    </MenuItem>
                                    <Divider sx={{ my: 0.5 }} />
                                    <MenuItem onClick={handleCloseMenu} disableRipple>
                                        FRIENDS
                                    </MenuItem>
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
                                    <MenuItem onClick={handleCloseMenu} disableRipple>
                                        TRIP
                                    </MenuItem>
                                    <MenuItem>
                                        {
                                            trip.trip.userId === auth.id ? 
                                                <Button size='small' startIcon={<AssignmentTurnedInIcon />} variant='contained'  onClick={handleCloseTrip} >
                                                    Mark Trip as Closed
                                                </Button>
                                            :   <Button startIcon={<AssignmentTurnedInIcon />} variant='contained'  style={{color: 'grey'}} disabled>
                                                    {trip.trip.user.username} can close this trip
                                                </Button>
                                        }
                                    </MenuItem>
                                    <Divider sx={{ my: 0.5 }} />
                                </StyledMenu>
                            </Box>
                        </Box>
                    </Grid>    
                    
                
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box bgcolor="primary.main" sx={{display: 'flex', justifyContent: 'center'}}>
                        <PeopleIcon fontSize='medium' />
                        <Typography variant='h6'>
                            &nbsp;Trip Friends
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='center'>
                        {
                            trip.trip.userTrips.map(user => (
                                <Box key={user.userId} marginRight={1} display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center' alignItems='center'
                                    sx={{':hover': { boxShadow: (theme) => theme.shadows[5] }}}
                                >
                                    <Avatar 
                                        sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} 
                                        src={user.user.avatar}
                                        >
                                        {user.user.firstName[0]+user.user.lastName[0]}
                                    </Avatar>
                                    <Typography variant='caption'>
                                        {user.user.username}
                                    </Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box bgcolor="primary.main" sx={{display: 'flex'}}>
                        <Box >
                            <Button component={Link} to={`${trip.tripId}/chat`} size='large' color='info' startIcon={<OpenInNewIcon />} className='expand' style={styles.expand}>
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <ChatIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Recent Messages Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    <MessagesTable messages={messages} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box bgcolor="primary.main"  sx={{display: 'flex'}}>
                        <Box >
                            <Button component={Link} to={`${trip.tripId}/calendar`} size='large' color='info' startIcon={<OpenInNewIcon />} className='expand' style={styles.expand}>
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <DateRangeIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Upcoming Events Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    <EventsTable events={events} />
                </Grid>
                
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box bgcolor="primary.main" sx={{display: 'flex'}}>
                        <Box >
                            <Button component={Link} to={`${trip.tripId}/expenses`} size='large' color='info' startIcon={<OpenInNewIcon />} className='expand' style={styles.expand}>
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon} bgcolor='primary.main'>
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
                                <PieChart expenses={tripExpenses} users={users} categories={categories}/> :
                                <Typography>
                                    No expenses yet.
                                </Typography>
                        }
                    </Box>
                </Grid>
                
            </Grid>
        </div>
    )
}
export default Trip;

const styles = {
    expand: {
        backgroundColor: 'darkslategrey',
        color: 'white',
        margin: 1

    },
    headingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        flexGrow: 1,
    },

}