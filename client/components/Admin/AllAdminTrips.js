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
import { getAdminUserTrips, leaveTrip } from "../../store";
import { getAdminTrips } from "../../store";

/////////////// DATE FORMATTER  ////////////////
import { format, parseISO, isAfter } from "date-fns";



const AllAdminTrips = ({ match }) => {
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getAdminTrips())
    }, [])

    ///////////  Trip View Selection //////////
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked)
    };
    // const { trips } = useSelector(state => state)
    let adminTrips = checked ? useSelector(state => state.adminTrips.filter(adminTrip => !adminTrip.trip.isOpen && adminTrip.tripInvite === 'accepted')) : useSelector(state => state.adminTrips.filter(adminTrip => adminTrip.trip.isOpen && adminTrip.tripInvite === 'accepted'))
    adminTrips = adminTrips.sort((a, b) => isAfter(new Date(a.trip.startTime), new Date(b.trip.startTime)) ? 1 : -1);

    const user = useSelector(state => state.auth)

    const handleLeaveTrip = async (usertripId) => {
        try {
            dispatch(leaveTrip(usertripId))
        }
        catch (error) {
            console.log(error)
        }

    }

    if (!adminTrips) {
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
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch
                            checked={checked}
                            onChange={handleChange}
                        />}
                        label='Past Trips'
                    />
                </FormGroup>
                <Box sx={{ display: 'flex', alignSelf: 'center' }}>
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
                        <Box style={{ textAlign: 'center' }} >
                            <Button startIcon={<AddIcon fontSize='large' />} variant='contained'>
                                Create Trip
                            </Button>
                        </Box>
                }
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {adminTrips.map(adminTrip => (
                    <Grid item xs={12} sm={6} key={adminTrip.id} >
                        <Paper sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                            <Box sx={{ color: 'inherit' }} component={Link} to={`/admin/admintrips/${adminTrip.tripId}`}>
                                <img src={adminTrip.trip.imageUrl} width='100%' height='240rem' />
                                <Typography variant='h6' align='center'>
                                    {adminTrip.trip.name}
                                </Typography>
                                <Typography align='center'>
                                    {adminTrip.trip.description}
                                </Typography>
                                <Box sx={{ m: 2 }}>
                                    <Typography sx={{ textDecoration: 'underline' }}>
                                        SUMMARY:
                                    </Typography>
                                    <Typography >
                                        Location: {adminTrip.trip.location}
                                    </Typography>
                                    <Typography >
                                        Start Date: {format(parseISO(adminTrip.trip.startTime), 'P')}
                                    </Typography>
                                    <Typography>
                                        End Date: {format(parseISO(adminTrip.trip.endTime), 'P')}
                                    </Typography>
                                    <Typography>
                                        Friends: {adminTrip.trip.userTrips.length}
                                    </Typography>
                                    <Box display='flex' justifyContent='center' alignItems='center'>
                                        <Typography >
                                            Trip Creator:
                                        </Typography>
                                        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                            <Avatar sx={{ height: 35, width: 35, m: 1, mb: 0 }} src={adminTrip.trip.user.avatar} >
                                                {adminTrip.trip.user.firstName[0] + adminTrip.trip.user.lastName[0]}
                                            </Avatar>
                                            <Typography variant='caption'>
                                                {adminTrip.trip.user.username}
                                            </Typography >
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {
                                !adminTrip.trip.expenses.length ?
                                    <Box sx={{ pb: 2, display: 'flex', justifyContent: 'center' }}>
                                        <Chip onClick={() => handleLeaveTrip(adminTrip.id)} label="leave this trip" variant="outlined" color="warning" icon={<ExitToAppIcon />}
                                            disabled={!adminTrip.trip.expenses.length ? false : true}
                                        />
                                    </Box>
                                    :
                                    <Tooltip title="You can not leave a trip that already has expenses." >
                                        <Box sx={{ pb: 2, display: 'flex', justifyContent: 'center' }}>
                                            <Chip label="leave this trip" variant="outlined" color="warning" icon={<ExitToAppIcon />}
                                                disabled={!adminTrip.trip.expenses.length ? false : true}
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

export default AllAdminTrips