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
import { Alert, Box, Button, IconButton, Typography, Dialog, Snackbar } from '@mui/material'
import Avatar from '@mui/material/Avatar';

////////////////// MATERIAL ICONS /////////////////
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';

import EventsAccordion from './EventsAccordion';

export default function TripMap({ match }) {
    const dispatch = useDispatch();
    const tripId = match.params.id;
    
    const auth = useSelector(state => state.auth);
    
    useEffect(() => {
        async function loadTrips(){
            await dispatch(getTrips())
        }
        loadTrips();
    }, [])

    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    let users = useSelector(state => state.users.filter(
        user => {
             if (user.userTrips.filter(userTrip => (userTrip.tripId === tripId)).length > 0) return true;
        }
    ));
    
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
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [openNoLocationAlert, setOpenNoLocationAlert] = useState(false);
    const [eventToEdit, setEventToEdit] = useState({});
    
    const mapRef = useRef();
    
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // const panTo = useCallback(({ lat, lng }) => {
    //     mapRef.current.panTo({ lat, lng });
    //     mapRef.current.setZoom(zoom);
    // }, []);
    
    
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
                // panTo({
                //     lat: position.coords.latitude,
                //     lng: position.coords.longitude,
                // });
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
        events.map( (event) => {
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

    if (!trip || !events || !users) {
        return <CircularLoading />
    }

    events = events.sort((a,b) => isAfter(parseISO(a.startTime), parseISO(b.startTime)) ? 1 : -1)

    const lat = +center.lat;
    const lng = +center.lng;
    console.log('SeLECTED', selected)
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
            <TripTitle trip={trip} />
            {
                trip.trip.isOpen ? 
                    <Box
                        display='flex'
                        justifyContent='center'
                        flexWrap='wrap'
                    >
                        <Box marginRight={3}>
                            {/* <Locate panTo={panTo} /> */}
                            <Locate  />
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
                            {/* <Tooltip title='Refresh Event Markers'> */}
                                <Button
                                    startIcon={<RefreshIcon />}
                                    variant='outlined'
                                    color='primary'
                                    size='small'
                                    onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}
                                >
                                    Refresh Event Markers
                                </Button>
                            {/* </Tooltip> */}
                        </Box>
                    </Box>
                    :
                    <Box textAlign='center'>
                        {/* <Tooltip title='Refresh Markers'> */}
                            <Button
                                startIcon={<RefreshIcon />}
                                variant='outlined'
                                color='primary'
                                size='small'
                                onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}
                            >
                                Refresh Event Markers
                            </Button>
                        {/* </Tooltip> */}
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
                                    // onClick={() => {
                                    //     trip.trip.isOpen ? handleFindTrackingMarker(user.id, user.username, setSelectedUser, setOpenNoLocationAlert, trackingMarkers, setSelected) : ''
                                    // }}
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
                <EventsAccordion trip={trip} events={events} handleFindMarker={handleFindMarker} tripOpen={trip.trip.isOpen} dispatch={dispatch} deleteEvent={deleteEvent} setSelected={setSelected} />
                {/* <Box
                    display='flex'
                    justifyContent='center'
                    marginBottom={.5}
                    flexWrap='wrap'
                    sx={{ maxHeight: 200, overflow: 'auto' }}
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
                                
                                    <Typography
                                        sx={{ m: 0 }}
                                        variant='subtitle2'
                                        color='text.light.primary'
                                    >
                                        {event.name}
                                    </Typography>
                                    <Typography
                                        color='text.light.secondary' variant="caption"
                                        sx={{ m: 0 }}
                                    >
                                        {event.description}
                                    </Typography>
                                    <Typography
                                        color='text.light.secondary' variant="caption"
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
                </Box> */}
                <GoogleMap
                    id='map'
                    options={options}
                    onLoad={onMapLoad}
                    zoom={zoom}
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
                                    position={{ lat: +selected.lat+.0003, lng: +selected.lng }}
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
