import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";

////////// STORE ///////////////
import { updateUser, deleteEvent, getTrips, getEvents } from '../../store';

////////// MUI ///////////////
import { Box, Grid, Button, TextField, Tooltip, Typography, Dialog, CardActionArea, Snackbar } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MuiAlert from '@mui/material/Alert';

////////// MATERIAL ICONS ///////////////
import RefreshIcon from '@mui/icons-material/Refresh';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close'

////////// DATE FNS ///////////////
import { parseISO, format } from 'date-fns';
////////// GOOGLE MAPS ///////////////
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

import EventForm from './EventForm'
import CircularLoading from '../Loading/CircularLoading'

////////// Map Styling ///////////////
import mapStyles from './mapStyles';
const mapContainerStyle = {
    height: "50vh",
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};
const tripZoom = 12;

export default function TripMap({ match }) {
    const dispatch = useDispatch();
    const tripId = match.params.id;
    
    const auth = useSelector(state => state.auth);
    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
    });

    const avgLat = events.reduce((accum, event) => {
        accum += +event.lat
        return accum
    }, 0) / events.length;

    const avgLng = events.reduce((accum, event) => {
        accum += +event.lng
        return accum
    }, 0) / events.length;

    const [markers, setMarkers] = useState([]);
    const [trackingMarkers, setTrackingMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [update, setUpdate] = useState(0);

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(tripZoom);
    }, []);

    const userLocation = useRef(null);
    const [status, setStatus] = useState('initial')


    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [openNoLocationAlert, setOpenNoLocationAlert] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setEventToEdit({})
        setOpenAlert(false);
        setOpenNoLocationAlert(false);
        setOpenSnackbar(false);
        setUpdate(prevUpdate => prevUpdate + Math.random())
    }
    
    const handleFindMarker = (id) => {
        const marker = markers.find(marker => marker.id === id);
        setSelected(marker);
    }
    const handleFindTrackingMarker = async (id, username) => {
        const trackingMarker = trackingMarkers.find(marker => marker.id === id);
        if (trackingMarker) {
            setSelected(trackingMarker)
        } else {
            await setSelectedUser(username)
            setOpenNoLocationAlert(true)
        }
    }
    const [eventToEdit, setEventToEdit] = useState({});

    const DisplayMarkers = () => {
        console.log('markers', markers)
        return markers.map((marker) => {
            return (
                <Marker
                    key={marker.key}
                    id={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    name={marker.name}
                    icon={{ url: marker.url }}
                    onClick={() => { setSelected(marker) }}
                />
            )
        })
    }
    const DisplayTrackingMarkers = () => {
        console.log('trackingmarkers', trackingMarkers)
        return trackingMarkers.map((marker) => {
            return (
                <Marker
                    key={marker.key}
                    id={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    name={marker.name}
                    onClick={() => { setSelected(marker) }}
                    // icon={{
                    //     url: marker.avatar,
                    //     origin: new google.maps.Point(0,0),
                    //     size: new google.maps.Size(20,32),
                    //     anchor: new google.maps.Point(0, 32)
                    // }}
                    // icon={
                    //     <Avatar 
                    //         sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} 
                    //         src={marker.avatar}
                    //         >
                    //         {marker.firstName[0]+marker.lastName[0]}
                    //     </Avatar>
                    // }
                    icon={{
                        url: '/person.svg',

                    }}
                />
            )
        })
    }


    const handleLocate = async () => {
        await navigator.geolocation.getCurrentPosition(
            async (position) => {
                await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date() }));
                userLocation.current = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                // await setTrackingMarkers(trackingMarkers.filter(marker => marker.id !== auth.id), { key: auth.id + Math.random().toString(16), id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, name: auth.username, time: format(new Date(), 'Pp') });
                let usersMarker = trackingMarkers.find(m => m.id === auth.id);

                usersMarker = { ...usersMarker, lat: position.coords.latitude, lng: position.coords.longitude, time: format(new Date(), 'Pp') };
                const otherUsersMarkers = trackingMarkers.filter(m => m.id !== auth.id);

                await setTrackingMarkers([...otherUsersMarkers, usersMarker]);
                panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => null
        );
        setStatus('watching');
        navigator.geolocation.watchPosition(async position => {
            userLocation.current = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date() }));
            let usersMarker = trackingMarkers.find(m => m.id === auth.id);
console.log('usersmarker', usersMarker)
            usersMarker = { ...usersMarker,  lat: position.coords.latitude, lng: position.coords.longitude, time: format(new Date(), 'Pp') };
            const otherUsersMarkers = trackingMarkers.filter(m => m.id !== auth.id);

            await setTrackingMarkers([...otherUsersMarkers, usersMarker]);
        })
        setOpenAlert(true);
    }
    function Locate({ panTo }) {
        return (

            <Button
                startIcon={<MyLocationIcon />}
                variant='outlined'
                className="locate"
                size='small'
                //TODO: USE WATCH POSITION AND SET TIMEOUT LATER TO CONTINUALLY UPDATE POSITION
                onClick={handleLocate}
            >
                PIN LOCATION
            </Button>
        );
    }
    // console.log(trip)
    let users = []
    useEffect(() => {
        // const users = trip.trip.userTrips
        setMarkers(prevMarkers => []);
        setTrackingMarkers(prevTrackingMarkers => []);

        events.forEach(event => {
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id, id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} - ${event.location}`, location: event.location, url: `/pin-10.svg` }])
        });

        users.forEach(user => {
            if (user.user.lat) {
                setTrackingMarkers(prevTrackingMarkers => [...prevTrackingMarkers, { name: user.user.username, time: format(parseISO(user.user.time), 'Pp'), key: user.userId, id: user.userId, lat: +user.user.lat, lng: +user.user.lng, avatar: user.user.avatar ? user.user.avatar : '/images/person.jpg', firstName: user.user.firstName, lastName: user.user.lastName }])
            }
        })
    }, [tripId, update])



    if (!trip || !events) {
        return <CircularLoading />
    }

    users = trip.trip.userTrips;

    if (trip && events.length === 0) return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} />
            </Dialog>
            <Button startIcon={<AddIcon />} variant='contained' color='info' onClick={() => setOpen(true)}>
                Add Event
            </Button>
        </>
    )

    return (
        <>
            <Snackbar
                open={openAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={2000}
                onClose={handleClose}
                title='Location pinned!'
                severity='success'
                sx={{width: '100%'}}
            >
                <Alert
                    onClose={handleClose}
                    severity='success'
                    sx={{ width: '100%' }}
                >
                    Location Pinned!
                </Alert>
            </Snackbar>
            <Snackbar
                open={openNoLocationAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity='info'
                    sx={{ width: '100%' }}
                >
                    {selectedUser} is not sharing location.
                </Alert>
            </Snackbar>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <EventForm
                    trip={trip}
                    event={eventToEdit}
                    handleClose={handleClose}
                />
            </Dialog>
            {/* <Tooltip title='Add Event'> */}
            <Box
                className='linkToTrip'
                display='flex'
                justifyContent='center'
                alignItems='center'
                marginTop={1}
            >
                <CardTravelIcon fontSize='medium' />
                <Box
                    sx={{ color: 'inherit' }}
                    component={Link}
                    to={`/trips/${trip.tripId}`}
                >
                    <Typography variant='h5'>
                        &nbsp;{trip.trip.name}
                        {
                            trip.trip.isOpen ? "" :
                                " (Closed)"
                        }
                    </Typography>
                </Box>
            </Box>
            {
                trip.trip.isOpen ?
                    <Box
                        display='flex'
                        justifyContent='center'
                    >
                        <Box marginRight={3}>
                            <Locate panTo={panTo} />
                        </Box>
                        <Box marginBottom={.5} marginRight={3} >
                            <Button
                                startIcon={<AddIcon />}
                                variant='contained'
                                color='primary'
                                onClick={() => setOpen(true)}
                                size='small'
                            >
                                Add Event
                            </Button>
                        </Box>
                        <Box >
                            <Tooltip title='Refresh Markers'>
                                <Button
                                    startIcon={<RefreshIcon />}
                                    variant='contained'
                                    color='primary'
                                    size='small'
                                    onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}
                                />
                            </Tooltip>
                        </Box>
                    </Box>
                : 
                    <Box >
                        <Tooltip title='Refresh Markers'>
                            <Button
                                startIcon={<RefreshIcon />}
                                variant='contained'
                                color='primary'
                                size='small'
                                onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}
                            />
                        </Tooltip>
                    </Box>
            }

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                    display='flex'
                    justifyContent='center'
                    marginTop={.5}
                    marginBottom={.5}
                >

                    {
                        users.map(user => (
                            <Box
                                key={user.userId}
                                marginRight={1}
                                padding={.25}
                                border='1px solid lightgrey'
                                borderRadius='10%'
                                display='flex'
                                flexDirection='column'
                                flexWrap='wrap' justifyContent='center' alignItems='center'
                                sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}
                            >
                                <Avatar
                                    sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main' }}
                                    src={user.user.avatar}
                                    onClick={
                                        () => {
                                            trip.trip.isOpen ? handleFindTrackingMarker(user.userId, user.user.username) : ''
                                        }
                                    }
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
                <Box
                    display='flex'
                    justifyContent='center'
                    marginBottom={.5}
                    flexWrap='wrap'
                >
                    {
                        events.map(event => (
                            <Box
                                display='flex'
                                flexDirection='column'
                                marginRight={1}
                                padding={.25}
                                border='1px solid lightgrey'
                                borderRadius='7%'
                                key={event.id}
                                onClick={() => handleFindMarker(event.id)}
                                justifyContent='center'
                                alignItems='center'
                                marginRight={1}
                                padding={.5}
                                sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}
                            >
                                <Box>
                                    <Typography
                                        sx={{ m: 0 }}
                                        variant='subtitle2'
                                    >
                                        {event.name}
                                    </Typography>
                                    <Typography
                                        color="text.secondary" variant="caption"
                                        sx={{ m: 0 }}
                                    >
                                        {format(parseISO(event.startTime), 'Pp')}
                                    </Typography>
                                </Box>
                                {
                                    trip.trip.isOpen ? 
                                        <Box
                                            display='flex'
                                            justifyContent='space-evenly'
                                        >
                                            <Button
                                                startIcon={<ModeEditIcon />} color='info'
                                                size='small'
                                                onClick={() => {
                                                    setEventToEdit(event);
                                                    setOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Snackbar
                                                sx={{ mt: 9 }}
                                                open={openSnackbar}
                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                autoHideDuration={6000}
                                                onClose={handleClose}
                                                message={`Are you sure you wish to delete this event? (${event.name})`}
                                                action={
                                                    <>
                                                        <Button color="secondary" size="small" onClick={async() => {
                                                            try {
                                                                await dispatch(deleteEvent(event.id))
                                                            } catch (err) {
                                                                console.log(err)
                                                            }
                                                        }}>
                                                            YES
                                                        </Button>
                                                        <Button color="secondary" size="small" onClick={handleClose}>
                                                            NO
                                                        </Button>
                                                        <IconButton
                                                            size="small"
                                                            aria-label="close"
                                                            color="inherit"
                                                            onClick={handleClose}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                }
                                            />
                                            <Button
                                                startIcon={<DeleteForeverIcon />} color='error'
                                                size='small'
                                                onClick={() => {setOpenSnackbar(true)}}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    : ''
                                }
                            </Box>
                        ))
                    }
                </Box>
                <GoogleMap
                    id='map'
                    options={options}
                    onLoad={onMapLoad}
                    zoom={tripZoom}
                    // zoom={tripId ? 8 : 3}
                    mapContainerStyle={mapContainerStyle}
                    style={mapStyles}
                    // center={{ lat: +trip.trip.lat, lng: +trip.trip.lng }}
                    center={{ lat: avgLat, lng: avgLng }}
                >
                    {
                        trip.trip.events.length ? <DisplayMarkers /> : ''
                    }
                    <DisplayTrackingMarkers />
                    {
                        selected ?
                            (
                                <InfoWindow
                                    open={open}
                                    position={{ lat: +selected.lat, lng: +selected.lng }}
                                    onCloseClick={() => {
                                        setSelected(null);
                                    }}
                                >
                                    <Box
                                        marginTop={.5}
                                        marginRight={1}
                                        marginBottom={.5}
                                        marginLeft={.5}
                                    >
                                        <Typography variant={'subtitle2'}>
                                            {selected.name}
                                        </Typography>
                                        <Typography variant={'caption'}>
                                            {selected.time}
                                        </Typography>
                                    </Box>
                                </InfoWindow>
                            )
                            : null
                    }
                </GoogleMap>

            </div>
        </>
    );
}

// <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
//                         {
//                             users.map(user => (
//                                 <Card className='card' key={user.userId} sx={{ minWidth: '100%', mb: 1, mt: 1 }}

//                                 >
//                                     <CardContent sx={{ mb: 0 }} onClick={() => handleFindTrackingMarker(user.userId, user.user.username)}>
//                                         {/* <CardContent sx={{ mb: 0}} > */}
//                                         <Typography gutterBottom>
//                                             {user.user.username}
//                                         </Typography>
//                                         <Typography color="text.secondary" variant="subtitle2" sx={{ mb: 0 }}>
//                                             {format(parseISO(user.user.time), 'Pp')}
//                                         </Typography>
//                                     </CardContent>
//                                 </Card>
//                             ))
//                         }
// </Box>
