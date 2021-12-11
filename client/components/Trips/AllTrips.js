import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";

////////////// MATERIAL UI ///////////
import { Avatar, Box, Button, Chip, Container, Divider, FormControlLabel, FormGroup, Switch, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Tooltip, Typography } from "@mui/material";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import CircularLoading from '../Loading/CircularLoading'

//////////////////////// STORE ///////////////////
import { getUserTrips, leaveTrip } from "../../store";
import { getTrips } from "../../store";

/////////////// DATE FORMATTER  ////////////////
import { format, parseISO, isAfter } from "date-fns";



const AllTrips = ({ match }) => {
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getTrips())
    }, [])

    ///////////  Trip View Selection //////////
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked)
    };
    // const { trips } = useSelector(state => state)
    let trips = checked ? useSelector(state => state.trips.filter(trip => !trip.trip.isOpen && trip.tripInvite === 'accepted')) : useSelector(state => state.trips.filter(trip => trip.trip.isOpen && trip.tripInvite === 'accepted'))
    trips = trips.sort((a, b) => isAfter(new Date(a.trip.startTime), new Date(b.trip.startTime)) ? 1 : -1);

    const user = useSelector(state => state.auth)

    const handleLeaveTrip = async (usertripId) => {
        try {
            dispatch(leaveTrip(usertripId))
        }
        catch (error) {
            console.log(error)
        }

    }

    if (!trips) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <CardTravelIcon fontSize='medium' />
                    {
                        checked ?
                            <Typography variant='h5'>
                                &nbsp;CLOSED TRIPS
                            </Typography>
                            :
                            <Typography variant='h5'>
                                &nbsp;ACTIVE TRIPS
                            </Typography>
                    }
                </Box>
                <CircularLoading />
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch
                            checked={checked}
                            onChange={handleChange}
                        />}
                        label='Closed Trips'
                    />
                </FormGroup>
                <Box sx={{ display: 'flex', alignSelf: 'center' }}>
                    <CardTravelIcon fontSize='medium' />
                    {
                        checked ?
                            <Typography variant='h5'>
                                &nbsp;CLOSED TRIPS
                            </Typography>
                            :
                            <>
                                <Typography variant='h5'>
                                    &nbsp;ACTIVE TRIPS
                                </Typography>
                            </>
                    }
                </Box>
                {
                    checked ? '' :
                        <Box style={{ textAlign: 'center' }} >
                            <Button startIcon={<AddIcon fontSize='large' />} component={Link} to="/trips/add" variant='contained'>
                                Create Trip
                            </Button>
                        </Box>
                }
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {trips.map(trip => (
                    <Grid item xs={12} sm={6} key={trip.id} >
                        <Paper sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                            <Box sx={{ color: 'inherit', textDecoration: 'none' }} component={Link} to={`/trips/${trip.tripId}`} >
                                <img src={trip.trip.imageUrl} width='100%' height='240rem' />
                                <Typography variant='h6' align='center'>
                                    {trip.trip.name}
                                </Typography>
                                <Typography align='center'>
                                    {trip.trip.description}
                                </Typography>
                                <Box sx={{ m: 2 }}>
                                    <Typography sx={{ textDecoration: 'underline' }}>
                                        SUMMARY
                                    </Typography>
                                    <Typography >
                                        Location: {trip.trip.location}
                                    </Typography>
                                    <Typography >
                                        Start Date: {format(parseISO(trip.trip.startTime), 'P')}
                                    </Typography>
                                    <Typography>
                                        End Date: {format(parseISO(trip.trip.endTime), 'P')}
                                    </Typography>
                                    <Typography>
                                        Friends: {trip.trip.userTrips.length}
                                    </Typography>
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
                                    </Box>
                                </Box>
                            </Box>
                            {
                                !trip.trip.isOpen ? ''
                                    :
                                !trip.trip.expenses.length ?
                                    <Box sx={{ pb: 2, display: 'flex', justifyContent: 'center' }}>
                                        <Chip onClick={() => handleLeaveTrip(trip.id)} label="leave this trip" variant="outlined" color="warning" icon={<ExitToAppIcon />}
                                            disabled={!trip.trip.expenses.length ? false : true}
                                        />
                                    </Box>
                                    :
                                    <Tooltip title="You can not leave a trip that already has expenses." >
                                        <Box sx={{ pb: 2, display: 'flex', justifyContent: 'center' }}>
                                            <Chip label="leave this trip" variant="outlined" color="warning" icon={<ExitToAppIcon />}
                                                disabled={!trip.trip.expenses.length ? false : true}
                                            />
                                        </Box>
                                    </Tooltip>
                            }
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default AllTrips