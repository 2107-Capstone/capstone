import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/////////////// STORE /////////////////
import { editTrip, getTrips, addUserDebt } from '../../store'

/////////////// COMPONENTS /////////////////
import CircularLoading from '../Loading/CircularLoading'
import EventForm from '../Map/EventForm'
import EventsTable from '../Events/EventsTable'
import ExpensesTable from '../Expenses/ExpensesTable'
import AddExpense from '../Expenses/AddExpense'
import MessagesTable from '../Chat/MessagesTable'
import InviteToTrip from './Form/InviteToTrip'
import TripDebts from '../Expenses/TripDebts'
import TripSpeedDial from './TripSpeedDial'
import AddTripForm from '../Trips/Form/AddTripForm'
import TripTitle from './Components/TripTitle'
import UserAvatar from './Components/UserAvatar'
import SnackbarForDelete from '../MuiComponents/SnackbarForDelete'
import TripButton from './Components/TripButton'

/////////////// MUI /////////////////
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import ChatIcon from '@mui/icons-material/Chat';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MapIcon from '@mui/icons-material/Map';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/People'
import WorkOffOutlinedIcon from '@mui/icons-material/WorkOffOutlined';

import theme from '../../theme'

import { settleUp } from '../Expenses/SettleUp'
import Summary from './Components/Summary'

const Trip = (props) => {
    const id = props.match.params.id

    const dispatch = useDispatch();
    
    const { auth, categories } = useSelector(state => state);

    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));
    const events = useSelector(state => state.events.filter(event => event.tripId === id));
    const messages = useSelector(state => state.messages.filter(message => message.tripId === id));
    const expenses = useSelector(state => state.expenses.filter(expense => expense.tripId === id));
    const users = useSelector(state => state.users.filter(user => {
        if(user.userTrips.find(userTrip => userTrip.tripId === id)) return true;
    }))

    useEffect(async () => {
        await dispatch(getTrips())
    }, [])
    
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleClose = () => {
        setOpen(false);
        setForm('')
        setOpenSnackbar(false)
    }
    
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    
    if (!trip || !events || !messages || !expenses) {
        return <CircularLoading />
    }
    
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
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

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

            <SnackbarForDelete open={openSnackbar} onClose={handleClose} onClickYes={handleCloseTrip} onClick={handleClose} message={'Are you sure you want to close this trip?'} />
            {
                trip.trip.isOpen && 
                    <Box sx={{marginBottom: -10, position: 'sticky', top: 5, right: 5, zIndex: 1}}>
                        <TripSpeedDial handleCloseMenu={handleCloseMenu} setOpen={setOpen} setForm={setForm}/>
                    </Box>
            }
            <Grid container rowSpacing={2} columnSpacing={2} >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                        <TripTitle trip={trip} type={'main'} />
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Typography >
                                Trip Creator:
                            </Typography>
                            <UserAvatar user={trip.trip.user} />
                            <Box>
                                {
                                    trip.trip.isOpen && 
                                    <>
                                        <Tooltip 
                                            title={trip.trip.user.id !== auth.id ? `Only ${trip.trip.user.username} can close this trip` : ''}
                                            placement='top'
                                            enterNextDelay={100}
                                            enterTouchDelay={300}
                                            leaveTouchDelay={1000}
                                        >
                                            <Box sx={{ml: 2, mb: 1}}>
                                                <Chip 
                                                    size='small' 
                                                    icon={<WorkOffOutlinedIcon fontSize='small' />} variant='outlined' 
                                                    label='Close trip' 
                                                    color='warning' 
                                                    onClick={() => setOpenSnackbar(true)} 
                                                    disabled={trip.trip.user.id !== auth.id}
                                                />
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
                                                <Chip 
                                                    size='small' 
                                                    icon={<ModeEditIcon fontSize='small'/>} color='warning' 
                                                    label="Edit trip" 
                                                    variant='outlined' 
                                                    onClick={() => {
                                                        setForm('trip');
                                                        setOpen(true)
                                                    }} 
                                                    disabled={trip.trip.user.id !== auth.id}
                                                />
                                            </Box>
                                        </Tooltip>
                                    </>
                                }
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-evenly' flexWrap='wrap' sx={{mb: 2, mt: 2}}>
                <TripButton id={trip.tripId} name={'chat'} icon={<ChatIcon />}/>
                <TripButton id={trip.tripId} name={'calendar'} icon={<DateRangeIcon />}/>
                <TripButton id={trip.tripId} name={'map'} icon={<MapIcon />}/>
            </Box>
            <Grid container spacing={2}>
                {
                    !trip.trip.isOpen &&
                    <Summary
                        trip={trip}
                        type={'Debt Summary'}
                        summaryTable={<TripDebts trip={trip} />}
                        icon={<PaidIcon fontSize='medium' />}
                    />
                }
                <Summary
                    trip={trip}
                    type={'Messages'}
                    link={`${trip.tripId}/chat`}
                    summaryTable={<MessagesTable messages={messages} />}
                    tooltipMessage={'Last five messages'}
                    icon={<ChatIcon fontSize='medium' />}
                />
                <Summary
                    trip={trip}
                    type={'Events'}
                    link={`${trip.tripId}/calendar`}
                    summaryTable={<EventsTable events={events} />}
                    tooltipMessage={'Next five events'}
                    icon={<DateRangeIcon fontSize='medium' />}
                />
                <Summary
                    trip={trip}
                    type={'expenses'}
                    link={`${trip.tripId}/expenses`}
                    tooltipMessage={'Last five paid expenses'}
                    icon={<PaidIcon fontSize='medium' />}
                    summaryTable={<ExpensesTable expenses={expenses} numUsers={users.length} />}
                />
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <Box style={styles.heading} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <PeopleIcon fontSize='medium' />
                        <Typography variant='h6'>
                            &nbsp;Trip Friends
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='center' flexWrap='wrap'>
                        {
                            users.map(user => 
                                <UserAvatar key={user.id} user={user} />
                            )
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
        // backgroundColor: theme.palette.primary.main,
        // border: `2px solid ${theme.palette.primary.main}`,
        flexGrow: 1,
        // color: 'white',
        borderRadius: 7
    },
    heading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `3px solid ${theme.palette.primary.main}`,
        flexGrow: 1,
        // color: 'white',
        borderRadius: 7
    },
    debtHeadingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        flexGrow: 1,
        color: 'white',
        borderRadius: 7
    },
}
