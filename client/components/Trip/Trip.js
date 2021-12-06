import React, { useEffect, useState } from 'react'

import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CircularLoading from '../Loading/CircularLoading'
import TripMap from '../Map/TripMap'
import { Participants, Events } from './tripInfo'
import Expenses from '../Expenses/Expenses'
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Box, Grid, Paper, TextField, Tooltip, Typography, Dialog } from '@mui/material'
import { closeTrip } from '../../store'
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
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
import PieChart from '../Expenses/PieChart'
import EventForm from '../Map/EventForm'
import EventsTable from '../Events/EventsTable'
import AddIcon from '@mui/icons-material/Add';
import AddExpense from '../Expenses/AddExpense'
import { format, formatISO, parseISO, isAfter, isBefore } from "date-fns";
import MessagesTable from '../Chat/MessagesTable'
import LockClockIcon from '@mui/icons-material/LockClock';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Trip = (props) => {
    const id = props.match.params.id
    const dispatch = useDispatch();

    const { auth, categories } = useSelector(state => state);

    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));
    let events = useSelector(state => state.events.filter(event => event.tripId === id));
    let messages = useSelector(state => state.messages.filter(message => message.tripId === id));

    // if (!trip) return <CircularLoading />
    if (!trip || !events || !messages) return <CircularLoading />
    //     if (!trip) return '...loading'
    //TODO: why does    trip = trip.trip    not allow refresh?
    // console.log('TRIPPPPPPPPPPPPP', trip)
    const tripExpenses = useSelector(state => state.expenses.filter(expense => expense.tripId === id));
    const totalExpenses = tripExpenses.reduce((total, expense) => {
        return total + +expense.amount
    }, 0);
    // const userTotal = tripExpenses.reduce((total, expense) => {
    //     if (expense.paidById === auth.id) {
    //         total += +expense.amount
    //     }
    //     return total;
    // }, 0);

    // if (!trip) return <CircularLoading />
    const handleCloseTrip = async() => {
        try {
            console.log(trip)
            await dispatch(closeTrip({...trip}))
        } catch (error) {
            console.log(error)
        }
    }

    const users = trip.trip.userTrips;

    // let events = trip.trip.events.sort((a,b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    events = events.sort((a,b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    events.length > 5 ? events.length = 5 : ''


    messages = messages.sort((a,b) => isBefore(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    messages.length > 5 ? messages.length = 5 : ''

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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
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
            <Dialog open={form === 'expense' && open} onClose={handleClose}>
                <AddExpense trip={trip} handleClose={handleClose}/>
            </Dialog>
            <Dialog open={form === 'event' && open} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} />
            </Dialog>
            <Grid container rowSpacing={2} columnSpacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignSelf: 'center', margin: 2}}>
                            <CardTravelIcon fontSize='medium' />
                            <Typography variant='h5'>
                                &nbsp;{trip.trip.name} 
                                {
                                    trip.trip.isOpen ? "" :
                                        "- Trip Closed"
                                }
                            </Typography>
                        </Box>
                        {/* <Box style={{textAlign:'center'}} > */}
                            <Box style={{display: 'flex', flexDirection: 'row', textAlign:'space-evenly'}} >
                                <Box>
                                    <ButtonGroup
                                        aria-label='large button group'
                                        >
                                        <Button component={Link} to={`${trip.tripId}/calendar`} color='secondary' startIcon={<DateRangeIcon />} >
                                            TRIP CALENDAR
                                        </Button>
                                        <Button component={Link} to={`${trip.tripId}/map`}  color='secondary' startIcon={<MapIcon />} >
                                            TRIP MAP
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                                
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
                                    >
                                        TRIP MENU
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
                                        <MenuItem onClick={handleCloseMenu} disableRipple>
                                            MESSAGES
                                        </MenuItem>
                                        <MenuItem>
                                            <Button component={Link} to={`${trip.tripId}/chat`} size='large' startIcon={<ChatIcon />} className='headingButton' style={styles.headingButton}>
                                                Group Chat Room
                                            </Button>
                                        </MenuItem>
                                        <Divider sx={{ my: 0.5 }} />
                                        <MenuItem onClick={handleCloseMenu} disableRipple>
                                            EVENTS
                                        </MenuItem>
                                        <MenuItem>
                                            <Button startIcon={<AddIcon />} variant='contained'  onClick={() => {
                                                handleCloseMenu();
                                                setOpen(true);
                                                setForm('event')
                                            }} className='headingButton' style={styles.headingButton}>
                                                Add Event
                                            </Button>
                                        </MenuItem>
                                        <Divider sx={{ my: 0.5 }} />

                                        <MenuItem onClick={handleCloseMenu} disableRipple>
                                            EXPENSES
                                        </MenuItem>
                                        <MenuItem>
                                            <Button startIcon={<AddIcon />} variant='contained'  onClick={() => {
                                                handleCloseMenu();
                                                setOpen(true);
                                                setForm('expense')
                                            }} className='headingButton' style={styles.headingButton}>
                                                Add Expense
                                            </Button>
                                        </MenuItem>
                                        <Divider sx={{ my: 0.5 }} />
                                        <MenuItem onClick={handleCloseMenu} disableRipple>
                                            FRIENDS
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            // setOpen(true);
                                            // setForm('expense')
                                        }}>
                                            <AddIcon />
                                            Add Friend to Trip
                                        </MenuItem>
                                        <Divider sx={{ my: 0.5 }} />
                                        <MenuItem onClick={handleCloseMenu} disableRipple>
                                            TRIP
                                        </MenuItem>
                                        <MenuItem>
                                            {
                                                trip.trip.userId === auth.id ? 
                                                    <Button startIcon={<AssignmentTurnedInIcon />} variant='contained'  onClick={handleCloseTrip} className='headingButton' style={styles.headingButton}>
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
                        {/* </Box> */}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                        <Box >
                            <Button component={Link} to={`${trip.tripId}/calendar`} size='large' color='info' startIcon={<OpenInNewIcon />} className='expand'  style={styles.expand}>
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <DateRangeIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Events Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    <EventsTable events={events}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                        <Box >
                            <Button component={Link} to={`${trip.tripId}/chat`} size='large' color='info' startIcon={<OpenInNewIcon />} className='expand' style={styles.expand}>
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <ChatIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Messages Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    <MessagesTable messages={messages} />
                </Grid>    
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                        <Box >
                            <Button component={Link} to={`${trip.tripId}/expenses`} size='large' color='info' startIcon={<OpenInNewIcon />} className='expand' style={styles.expand}>
                            </Button>
                        </Box>
                        <Box style={styles.headingIcon}>
                            <PaidIcon fontSize='medium' />
                            <Typography variant='h6'>
                                &nbsp;Expenses Snapshot
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', mx: 1, mb: 2}}>
                       
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
                <Grid item xs={12} sm={12} md={12} lg={6} >
                    <Box sx={{display: 'flex', backgroundColor: 'cornsilk'}}>
                        <PeopleIcon fontSize='medium' />
                        <Typography variant='h6'>
                            &nbsp;Trip Friends
                        </Typography>
                    </Box>
                    
                    {trip.trip.userTrips.map(user => (
                    <Paper  key={user.id} sx={{ margin: '1rem', height: 'fit-content', ':hover': { boxShadow: (theme) => theme.shadows[5] } }}>
                        <Box sx={{alignItems: 'center'}}>
                            <Avatar sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} src={user.user.avatar} >
                                {user.user.firstName[0]+user.user.lastName[0]}
                            </Avatar>
                            {/* <Avatar alt={user.user.username} src="https://cdn3.iconfinder.com/data/icons/avatars-flat/33/man_5-512.png" /> */}
                        </Box>
                        <Box sx={{ color: 'inherit', alignItems: 'center'}}>
                            <Typography variant='h6'>
                                {user.user.username}
                            </Typography>
                        </Box>
                    </Paper>
                    ))}
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
    headingButton: {
      margin: 1,
      color: 'black',
      backgroundColor: 'dodgerBlue'
    },
    headingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'cornsilk',
        flexGrow: 1,
    },

  }