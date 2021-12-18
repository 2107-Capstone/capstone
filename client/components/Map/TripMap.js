import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser, deleteEvent, getTrips } from '../../store';
import { parseISO, format, isAfter } from 'date-fns';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

////////////////// COMPONENTS /////////////////
import TripTitle from '../Trip/Components/TripTitle';
import EventForm from './EventForm'
import CircularLoading from '../Loading/CircularLoading'
import { findZoom, findCenter } from './mapFunctions';
import mapStyles from './mapStyles';
import SnackbarForDelete from '../MuiComponents/SnackbarForDelete';

////////////////// MATERIAL UI /////////////////
import { Alert, Avatar, Box, Button, Typography, Dialog, Snackbar } from '@mui/material'

////////////////// MATERIAL ICONS /////////////////
import { Add as AddIcon, Close as CloseIcon, Refresh as RefreshIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';

import EventsAccordion from './EventsAccordion';

export default function TripMap({ match }) {
    const dispatch = useDispatch();
    const tripId = match.params.id;

    const auth = useSelector(state => state.auth);

    useEffect(() => {
        async function loadTrips() {
            await dispatch(getTrips())
        }
        loadTrips();
    }, [])

    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    // let users = useSelector(state => state.users.filter(
    //     user => {
    //         if (user.userTrips.filter(userTrip => (userTrip.tripId === tripId && userTrip.tripInvite === 'accepted')).length > 0) return true;
    //     }
    // ));
    
    const userTrips = useSelector(state => state.usertrips.filter(userTrip => (
        userTrip.tripId === tripId && userTrip.tripInvite === 'accepted'
    )))

    const mapContainerStyle = {
        height: "50vh",
    };

    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
    };

    const [markers, setMarkers] = useState([]);
    const [trackingMarkers, setTrackingMarkers] = useState([]);
    const [selected, setSelected] = useState('');
    const [update, setUpdate] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [open, setOpen] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [openNoLocationAlert, setOpenNoLocationAlert] = useState(false);
    const [eventToEdit, setEventToEdit] = useState({});

    const mapRef = useRef();

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);


    const handleClose = () => {
        setOpen(false);
        setEventToEdit({})
        setOpenAlert(false);
        setOpenNoLocationAlert(false);
        setSelectedUser('')
        setSelected('')
    }

    const handleFindMarker = (id, setSelected) => {
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

    const DisplayMarkers = () => {
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
    const userLocation = useRef(null);
    const handleLocate = async () => {
        // if ('geolocation' in navigator === false) {
        //     Alert('Geolocation is not supported by your device.')
        // }
        await navigator.geolocation.getCurrentPosition(
            async (position) => {
                await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date() }, 'geolocation'));
                userLocation.current = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                await setUpdate(prevUpdate => prevUpdate + Math.random())
            },
            () => null
        );
        setOpenAlert(true);
    }

    // function Locate({ panTo }) {
    function Locate() {
        return (

            <Button
                startIcon={<MyLocationIcon />}
                variant='outlined'
                className="locate"
                size='small'
                onClick={handleLocate}
            >
                PIN LOCATION
            </Button>
        );
    }
    const defaultCoords = {
        lat: 34.456748,
        lng: -75.462405
    }

    const [zoom, setZoom] = useState(3);
    const [center, setCenter] = useState(defaultCoords);

    useEffect(() => {
        setMarkers(() => []);
        setTrackingMarkers(() => []);
        events.map((event) => {
            setMarkers((prevMarkers) => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id, id: event.id, lat: +event.lat, lng: +event.lng, name: event.name, location: event.location, url: `/pin-10.svg` }])
        });

        if (trip?.trip.isOpen){
            users.map( (user) => {
                if (user.lat) {
                    setTrackingMarkers((prevTrackingMarkers) => [...prevTrackingMarkers, { name: user.username, time: format(parseISO(user.time), 'Pp'), key: user.id, id: user.id, lat: +user.lat, lng: +user.lng, avatar: '/person.svg', firstName: user.firstName, lastName: user.lastName }])
                }
            })
        }
        if (markers.length !== 0 && !selected && !selectedUser) {
            setZoom(() => findZoom(events))
            setCenter(() => findCenter(events))
        }
    }, [tripId, update, markers.length])

    useEffect(() => {
        if (!!selected) {
            setCenter(() => ({ lat: selected.lat, lng: selected.lng }))
            setZoom(() => 13)
        }
    }, [selected])

    useEffect(() => {
        setOpenInfo(() => false)
        setUpdate(() => Math.random())
        if (markers.length !== 0) {
            setZoom(() => findZoom(events))
            setCenter(() => findCenter(events))
        }
    }, [events.length])

    if (!trip || !events || !userTrips) {
        return <CircularLoading />
    }

    const users = userTrips.map(userTrip => userTrip.user)
    events = events.sort((a, b) => isAfter(parseISO(a.startTime), parseISO(b.startTime)) ? 1 : -1)

    const lat = +center.lat;
    const lng = +center.lng;
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
                    setOpenInfo={setOpenInfo}
                />
            </Dialog>
            <TripTitle trip={trip} />
            {
                trip.trip.isOpen ?
                    <Box
                        display='flex'
                        justifyContent='center'
                        flexWrap='wrap'
                    >
                        <Box marginRight={3}>
                            <Locate />
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
                            <Button
                                startIcon={<RefreshIcon />}
                                variant='outlined'
                                color='primary'
                                size='small'
                                onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}
                            >
                                Refresh Event Markers
                            </Button>
                        </Box>
                    </Box>
                    :
                    <Box textAlign='center'>
                        <Button
                            startIcon={<RefreshIcon />}
                            variant='outlined'
                            color='primary'
                            size='small'
                            onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}
                        >
                            Refresh Event Markers
                        </Button>
                    </Box>
            }

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                    display='flex'
                    justifyContent='center'
                    marginTop={.5}
                    marginBottom={.5}
                    flexWrap='wrap'
                    sx={{ maxHeight: 200, overflow: 'auto' }}
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
                <EventsAccordion trip={trip} events={events} handleFindMarker={handleFindMarker} tripOpen={trip.trip.isOpen} dispatch={dispatch} deleteEvent={deleteEvent} setSelected={setSelected} setUpdate={setUpdate} />  
                <GoogleMap
                    id='map'
                    options={options}
                    onLoad={onMapLoad}
                    zoom={zoom}
                    mapContainerStyle={mapContainerStyle}
                    style={mapStyles}
                    center={{ lat, lng }}
                >
                    {
                        trip.trip.events.length ? <DisplayMarkers markers={markers} setSelected={setSelected} /> : ''
                    }
                    {
                        trip.trip.isOpen ? <DisplayTrackingMarkers trackingMarkers={trackingMarkers} /> : ''
                    }
                    {
                        selected ?
                            (
                                <InfoWindow
                                    open={openInfo}
                                    position={{ lat: +selected.lat + .0003, lng: +selected.lng }}
                                    onCloseClick={() => {
                                        setSelected(null);
                                    }}
                                >
                                    <Box
                                        marginTop={.5}
                                        marginRight={1}
                                        marginBottom={.5}
                                        marginLeft={.5}
                                        textAlign='center'
                                    >
                                        <Typography variant='subtitle2'
                                            color='text.dark.primary'
                                        >
                                            {selected.name}
                                        </Typography>
                                        <Box textAlign='center'>
                                            {
                                                selected.url ?
                                                    <Typography variant='caption'
                                                        color='text.dark.primary'
                                                    >
                                                        {selected.location}
                                                    </Typography>
                                                    :
                                                    <Typography variant='caption' color='text.dark.secondary'>
                                                        pinned at
                                                    </Typography>
                                            }
                                        </Box>
                                        <br></br>
                                        <Typography variant='caption' color='text.dark.secondary'>
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
