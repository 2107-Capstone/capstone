import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { parseISO, format } from 'date-fns';
import { Box, Grid, Button, TextField, Tooltip, IconButton, Typography, Dialog, CardActionArea, Snackbar } from '@mui/material'
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
import CloseIcon from '@mui/icons-material/Close';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

import { handleFindMarker, handleFindTrackingMarker, DisplayMarkers, DisplayTrackingMarkers } from './Markers';

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

    const auth = useSelector(state => state.auth);

    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    let users = useSelector(state => state.users.filter(
        user => {
             if (user.userTrips.filter(userTrip => (userTrip.tripId === tripId)).length > 0) return true;
        }
    ));

    const [markers, setMarkers] = useState([]);
    const [trackingMarkers, setTrackingMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [update, setUpdate] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(tripZoom);
    }, []);

    const userLocation = useRef(null);
    // const [status, setStatus] = useState('initial')


    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [openNoLocationAlert, setOpenNoLocationAlert] = useState(false);
    const [eventToEdit, setEventToEdit] = useState({});
    
    const handleClose = () => {
        setOpen(false);
        setEventToEdit({})
        setOpenAlert(false);
        setOpenNoLocationAlert(false);
        setOpenSnackbar(false)
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
    
    useEffect(() => {
        const createAllMarkers = async() => {
            await setMarkers([]);
            await setTrackingMarkers([]);
    
            events.forEach(async (event) => {
                await setMarkers((prevMarkers) => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id, id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} - ${event.location}`, location: event.location, url: `/pin-10.svg` }])
            });
            if (trip?.trip.isOpen){
                users.forEach(async (user) => {
                    if (user.lat) {
                        await setTrackingMarkers((prevTrackingMarkers) => [...prevTrackingMarkers, { name: user.username, time: format(parseISO(user.time), 'Pp'), key: user.id, id: user.id, lat: +user.lat, lng: +user.lng, avatar: '/person.svg', firstName: user.firstName, lastName: user.lastName }])
                    }
                })
            }
        }
        // console.log(status)
        createAllMarkers();
        // () => setStatus('initial')
    }, [tripId, update])

    if (!trip || !events || !users) {
        return <CircularLoading />
    }

    const lat = events.length === 0 ? 
        +trip.trip.lat
        :
        events.reduce((accum, event) => {
            accum += +event.lat
            return accum
        }, 0) / events.length

    const lng = events.length === 0 ?
        +trip.trip.lng
        :
        events.reduce((accum, event) => {
            accum += +event.lng
            return accum
        }, 0) / events.length;
    

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
                                        trip.trip.isOpen ? handleFindTrackingMarker(user.id, user.username, setSelectedUser, setOpenNoLocationAlert, trackingMarkers, setSelected) : ''
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
                                onClick={() => handleFindMarker(setSelected, markers, event.id)}
                                justifyContent='center'
                                alignItems='center'
                                marginRight={1}
                                padding={.5}
                                sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}
                            >
                                
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
                                        {event.description}
                                    </Typography>
                                    <Typography
                                        color="text.secondary" variant="caption"
                                        sx={{ m: 0 }}
                                    >
                                        {format(parseISO(event.startTime), 'P')}
                                    </Typography>
                                
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
                                                message={'Are you sure you want to delete this event?'}
                                                action={
                                                    <>
                                                        <Button color="secondary" size="small" 
                                                            onClick={async () => {
                                                                try {
                                                                    await dispatch(deleteEvent(event.id))
                                                                } catch (err) {
                                                                    console.log(err)
                                                                }
                                                            }}
                                                        >
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
                                                onClick={() => setOpenSnackbar(true)}
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
                    mapContainerStyle={mapContainerStyle}
                    style={mapStyles}
                    center={{lat, lng}}
                >
                    {
                        trip.trip.events.length ? <DisplayMarkers markers={markers} setSelected={setSelected}/> : ''
                    }
                    {
                        trip.trip.isOpen ? <DisplayTrackingMarkers trackingMarkers={trackingMarkers}/> : ''
                    }
                    {
                        selected ?
                            (
                                <InfoWindow
                                    open={open}
                                    position={{ lat: +selected.lat+.001, lng: +selected.lng }}
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
