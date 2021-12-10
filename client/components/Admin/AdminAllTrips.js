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
import { getAdminUserTrips } from "../../store";
import { getAdminTrips } from "../../store";

/////////////// DATE FORMATTER  ////////////////
import { format, parseISO, isAfter } from "date-fns";



const AdminAllTrips = ({ match }) => {
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
    let adminTrips = checked ? useSelector(state => state.adminTrips.filter(adminTrip => !adminTrip.isOpen && adminTrip.userTrips[0].tripInvite === 'accepted')) : useSelector(state => state.adminTrips.filter(adminTrip => adminTrip.isOpen && adminTrip.userTrips[0].tripInvite === 'accepted'))
    adminTrips = adminTrips.sort((a, b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);

    const user = useSelector(state => state.auth)

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
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {adminTrips.map(adminTrip => (
                    <Grid item xs={12} sm={6} key={adminTrip.id} >
                        <Paper sx={{ ':hover': { cursor: 'pointer', boxShadow: (theme) => theme.shadows[5] } }}>
                            <Box sx={{ color: 'inherit', textDecoration: 'none' }} component={Link} to={`/admin/admintrips/${adminTrip.id}`}>
                                <img src={adminTrip.imageUrl} width='100%' height='240rem' />
                                <Typography variant='h6' align='center'>
                                    {adminTrip.name}
                                </Typography>
                                <Typography align='center'>
                                    {adminTrip.description}
                                </Typography>
                                <Box sx={{ m: 2 }}>
                                    <Typography sx={{ textDecoration: 'underline' }}>
                                        SUMMARY:
                                    </Typography>
                                    <Typography >
                                        Location: {adminTrip.location}
                                    </Typography>
                                    <Typography >
                                        Start Date: {format(parseISO(adminTrip.startTime), 'P')}
                                    </Typography>
                                    <Typography>
                                        End Date: {format(parseISO(adminTrip.endTime), 'P')}
                                    </Typography>
                                    <Typography>
                                        Friends: {adminTrip.userTrips.length}
                                    </Typography>
                                    <Box display='flex' justifyContent='center' alignItems='center'>
                                        <Typography >
                                            Trip Creator:
                                        </Typography>
                                        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                            <Avatar sx={{ height: 35, width: 35, m: 1, mb: 0, bgcolor: 'primary.main' }} src={adminTrip.user.avatar} >
                                                {adminTrip.user.firstName[0] + adminTrip.user.lastName[0]}
                                            </Avatar>
                                            <Typography variant='caption'>
                                                {adminTrip.user.username}
                                            </Typography >
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default AdminAllTrips