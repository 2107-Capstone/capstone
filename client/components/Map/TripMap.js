import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { parseISO, format } from 'date-fns';
import { Box, Grid, Button, TextField, Tooltip, Typography, Dialog, CardActionArea, Snackbar } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MuiAlert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import EventForm from './EventForm'
import CircularLoading from '../Loading/CircularLoading'
import { updateUser, deleteEvent, getTrips, getEvents } from '../../store';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";


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

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
    });

    // useEffect(async () => {
    //     try {
    //         await dispatch(getTrips())
    //         await dispatch(getEvents())
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }, [])

    const auth = useSelector(state => state.auth);

    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    let users = useSelector(state => state.users.filter(
        user => {
             if (user.userTrips.filter(userTrip => (userTrip.tripId === tripId)).length > 0) return true;
        }
    ));

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

    const handleClose = () => {
        setOpen(false);
        setEventToEdit({})
        setOpenAlert(false);
        setOpenNoLocationAlert(false);
        setUpdate(prevUpdate => prevUpdate + Math.random())
    }
    //TODO: rename these
    const handleFindMarker = (id) => {
        // setUpdate(prevUpdate => prevUpdate + Math.random())
        const marker = markers.find(marker => marker.id === id);
        // ev.stopPropagation()
        setSelected(marker);
    }
    const handleFindTrackingMarker = async (id, username) => {
        // setUpdate(prevUpdate => prevUpdate + Math.random())
        const trackingMarker = trackingMarkers.find(marker => marker.id === id);
        // ev.stopPropagation()
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
                    icon={{
                        url: '/person.svg',

                    }}
                />
            )
        })
    }

    const handleLocate = async () => {
        // if ('geolocation' in navigator === false) {
        //     Alert('Geolocation is not supported by your device.')
        // }
        await navigator.geolocation.getCurrentPosition(
            async (position) => {
                await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date() }));
                userLocation.current = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                await setUpdate(prevUpdate => prevUpdate + Math.random())
                panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => null
        );
        // setStatus('watching');
        // navigator.geolocation.watchPosition(async position => {
        //     userLocation.current = {
        //         lat: position.coords.latitude,
        //         lng: position.coords.longitude
        //     }
        //     if (status === 'watching'){
        //         await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date() }));
        //         await setUpdate(prevUpdate => prevUpdate + Math.random())
        //     }
            // let usersMarker = trackingMarkers.find(m => m.id === auth.id);

            // usersMarker = { ...usersMarker, key: usersMarker.key + 1, lat: position.coords.latitude, lng: position.coords.longitude, time: format(new Date(), 'Pp') };
            // const otherUsersMarkers = trackingMarkers.filter(m => m.id !== auth.id);

            // await setTrackingMarkers([...otherUsersMarkers, usersMarker]);
        // }, null, {
        //     enableHighAccuracy: true,
        //     timeout: 5000,
        //     maximumAge: 0
        // })
        // setOpenAlert(true);
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
    // console.log(users)
    // let users = []
    useEffect(() => {
        // setMarkers(prevMarkers => []);
        // setTrackingMarkers(prevTrackingMarkers => []);
        const createAllMarkers = async() => {
            await setMarkers([]);
            await setTrackingMarkers([]);
    
            events.forEach(async (event) => {
                await setMarkers((prevMarkers) => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id, id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} - ${event.location}`, location: event.location, url: `/pin-10.svg` }])
            });
            if (trip.trip.isOpen){
                users.forEach(async (user) => {
                    if (user.lat) {
                        await setTrackingMarkers((prevTrackingMarkers) => [...prevTrackingMarkers, { name: user.username, time: format(parseISO(user.time), 'Pp'), key: user.id, id: user.id, lat: +user.lat, lng: +user.lng, avatar: '/images/person.jpg', firstName: user.firstName, lastName: user.lastName }])
                    }
                })
            }
        }
        console.log(status)
        createAllMarkers();
        () => setStatus('initial')
    }, [tripId, update])



    if (!trip || !events || !users) {
        return <CircularLoading />
    }

    // users = trip.trip.userTrips;

    // if (trip && events.length === 0) return (
    //     <>
    //         <Dialog open={open} onClose={handleClose}>
    //             <EventForm trip={trip} handleClose={handleClose} />
    //         </Dialog>
    //         <Box
    //             className='linkToTrip'
    //             display='flex'
    //             justifyContent='center'
    //             alignItems='center'
    //             marginTop={1}
    //         >
    //             <CardTravelIcon fontSize='medium' />
    //             <Box
    //                 sx={{ color: 'inherit' }}
    //                 component={Link}
    //                 to={`/trips/${trip.tripId}`}
    //             >
    //                 <Typography variant='h5'>
    //                     &nbsp;{trip.trip.name}
    //                 </Typography>
    //             </Box>
    //         </Box>
    //         <Button startIcon={<AddIcon />} variant='contained' color='info' onClick={() => setOpen(true)}>
    //             Add Event
    //         </Button>
            
    //     </>
    // )

    return (
        <>
            <Snackbar
                open={openAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={2000}
                onClose={handleClose}
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
                <Box sx={{ color: 'inherit' }} component={Link} to={`/trips/${trip.tripId}`}>
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
                    <Box textAlign='center'>
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
                    flexWrap='wrap'
                >

                    {
                        users.map(user => (
                            <Box
                                key={user.id}
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
                                    src={user.avatar}
                                    onClick={() => {
                                        trip.trip.isOpen ? handleFindTrackingMarker(user.id, user.username) : ''
                                    }}
                                >
                                    {user.firstName[0] + user.lastName[0]}
                                </Avatar>
                                <Typography variant='caption'>
                                    {user.username}
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
                                            <Button
                                                startIcon={<DeleteForeverIcon />} color='error'
                                                size='small'
                                                onClick={async () => {
                                                    try {
                                                        await dispatch(deleteEvent(event.id))
                                                    } catch (err) {
                                                        console.log(err)
                                                    }
                                                }}
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
                    center={events.length !== 0 ? { lat: avgLat, lng: avgLng } : {lat: trip.lat, lng: trip.lng}}
                >
                    {
                        trip.trip.events.length ? <DisplayMarkers /> : ''
                    }
                    {
                        trip.trip.isOpen ? <DisplayTrackingMarkers /> : ''
                    }
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
