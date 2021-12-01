import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { getTrips } from "../../store";

////////////// MATERIAL UI ///////////
import { Box, Button, Chip, Container, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import CircularLoading from '../Loading/CircularLoading'

/////////////// DATE FORMATTER  ////////////////
import { format, parseISO } from "date-fns";

const handleLeaveTrip = () => { }


const AllTrips = () => {
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getTrips())
    }, [])

    const { trips } = useSelector(state => state)
    const user = useSelector(state => state.auth)

    ///////////  Trip View Selection //////////
    const [showTrips, setshowTrips] = useState('all');

    const handleChange = (event) => {
        setshowTrips(event.target.value);
    };

    if (!trips) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    <CardTravelIcon fontSize='medium' />
                    <Typography variant='h5'>
                        &nbsp;ALL TRIPS
                    </Typography>
                </Box>
                <CircularLoading />
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Typography variant='h5'>
                    &nbsp;ALL TRIPS
                </Typography>
            </Box>
            <Button component={Link} to="/trips/add" variant='outlined'>
                Add New Trip
            </Button>
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
                            <Box sx={{ color: 'inherit' }} component={Link} to={`/trip/${trip.tripId}`}>
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
                                        Friends: {trip.trip.userTrips.length}
                                    </Typography>
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