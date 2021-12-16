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
import AdminTripTitle from './AdminTripTitle';
import EventsAccordion from '../Map/EventsAccordion';

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

    let trip = useSelector(state => state.adminTrips.find(adminTrip => adminTrip.id === tripId));
    let events = useSelector(state => state.adminEvents.filter(adminEvent => adminEvent.tripId === tripId));

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
    const handleClick = (id) => {
        // setUpdate(prevUpdate => prevUpdate + Math.random())
        const marker = markers.find(marker => marker.id === id);
        // ev.stopPropagation()
        setSelected(marker);
    }
    const handleClick2 = async (id, username) => {
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

    const handleFindMarker = (id, setSelected) => {
        const marker = markers.find(marker => marker.id === id);
        setSelected(marker);
    }

    console.log(trip)
    let users = []
    useEffect(() => {
        setMarkers(prevMarkers => []);
        setTrackingMarkers(prevTrackingMarkers => []);

        events.forEach(event => {
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id, id: event.id, lat: +event.lat, lng: +event.lng, name: event.name, location: event.location, url: `/pin-10.svg` }])
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

    users = trip.userTrips;

    if (trip && events.length === 0) return (
        <>
            <Typography variant='contained' color='info' >
                No Events!
            </Typography>
        </>
    )

    return (
        <>
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
            <AdminTripTitle trip={trip} />
            <Box
                display='flex'
                justifyContent='center'
            >
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
            </Box>

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
                                    onClick={() => handleClick2(user.userId, user.user.username)}
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
                <EventsAccordion trip={trip} events={events} handleFindMarker={handleFindMarker} tripOpen={trip.isOpen} dispatch={dispatch} deleteEvent={deleteEvent} setSelected={setSelected} setUpdate={setUpdate} />  

                <GoogleMap
                    id='map'
                    options={options}
                    onLoad={onMapLoad}
                    zoom={tripZoom}
                    mapContainerStyle={mapContainerStyle}
                    style={mapStyles}
                    center={{ lat: avgLat, lng: avgLng }}
                >
                    {
                        trip.events.length ? <DisplayMarkers markers={markers} setSelected={setSelected}/> : ''
                    }
                    <DisplayTrackingMarkers />
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
