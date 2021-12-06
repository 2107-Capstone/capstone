import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";

////////////// MATERIAL UI ///////////
import { Avatar, Box, Button, Chip, Container, Divider, FormControlLabel, FormGroup, Switch, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import CircularLoading from '../Loading/CircularLoading'

//////////////////////// STORE ///////////////////
import { getUserTrips } from "../../store";
import { getTrips } from "../../store";

/////////////// DATE FORMATTER  ////////////////
import { format, parseISO } from "date-fns";

const handleLeaveTrip = () => { }


const AllTrips = ({ match }) => {
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getTrips())
    }, [])

    ///////////  Trip View Selection //////////
    // const [showTrips, setshowTrips] = useState('all');
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked)
    };
    // const { trips } = useSelector(state => state)
    const trips = checked ? useSelector(state => state.trips.filter(trip => !trip.trip.isOpen)) : useSelector(state => state.trips.filter(trip => trip.trip.isOpen))
    const user = useSelector(state => state.auth)


    if (!trips) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <CardTravelIcon fontSize='medium' />
                    {
                        checked ?
                            <Typography variant='h5'>
                                &nbsp;PAST TRIPS
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
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', mt: 1 }}>
                <FormGroup>
                    <FormControlLabel 
                        control={<Switch 
                        checked={checked}
                        onChange={handleChange}
                        />}
                        label='Past Trips'
                    />
                </FormGroup>
                <Box sx={{ display: 'flex', alignSelf: 'center'}}>
                    <CardTravelIcon fontSize='medium' />
                    {
                        checked ?
                        <Typography variant='h5'>
                                &nbsp;PAST TRIPS
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
                            <Box style={{textAlign:'center'}} >
                                <Button startIcon={<AddIcon fontSize='large'/>}component={Link} to="/trips/add" variant='contained' sx={{width: '30%'}}>
                                    Create Trip
                                </Button>
                            </Box>
                    }
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Show Trips</InputLabel>
                    <Select
                        value={showTrips}
                        label="Show Trips"
                        onChange={handleChange}
                    >
                        <MenuItem value='all'>ALL</MenuItem>
                        <MenuItem value='active'>ACTIVE TRIPS</MenuItem>
                        <MenuItem value='inactive'>PAST TRIPS</MenuItem>
                    </Select>
                </FormControl>
            </Box> */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {trips.map(trip => (
                    <Grid item xs={12} sm={6} key={trip.id} >
                        <Paper sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                            <Box sx={{ color: 'inherit' }} component={Link} to={`/trips/${trip.tripId}`}>
                                <img src={trip.trip.imageUrl} width='100%' height='240rem' />
                                <Typography variant='h6' align='center'>
                                    {trip.trip.name}
                                </Typography>
                                <Typography align='center'>
                                    {trip.trip.description}
                                </Typography>
                                <Box sx={{ m: 2 }}>
                                    <Typography sx={{ textDecoration: 'underline' }}>
                                        SUMMARY:
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
                                        {/* Friends: {trip.trip.userTrips.length} */}
                                    </Typography>
                                    <Box display='flex' justifyContent='center' alignItems='center'>
                                        <Typography >
                                            Trip Creator: {trip.trip.user.username}
                                        </Typography>
                                        <Avatar sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} src={trip.trip.user.avatar} >
                                            {trip.trip.user.firstName[0]+trip.trip.user.lastName[0]}
                                        </Avatar>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ pb: 2, display: 'flex', justifyContent: 'center' }}>
                                <Chip onClick={handleLeaveTrip} label="leave this trip" variant="outlined" color="warning" icon={<ExitToAppIcon />} />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default AllTrips


{/* <ul>
    {
        trips.length === 0 ? <h5>No Trips :(</h5> :
            trips.map(trip => (
                <div key={trip.id + Math.random().toString(16)}>
                    <pre>
                        {JSON.stringify(trip, null, 2)}
                    </pre>
                    <li>
                        <Link to={`/trip/${trip.tripId}`}>{trip.trip.name}</Link>
                    </li>
                </div>
            ))
    }
</ul> */}