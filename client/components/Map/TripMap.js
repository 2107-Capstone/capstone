import React, { useEffect, useState, useRef } from 'react'
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
import { updateUser, deleteEvent } from '../../store';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";


import mapStyles from './mapStyles';

const mapContainerStyle = {
    height: "95vh",
    width: "95vw",
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};
const tripZoom = 12;

// export default function TripMap({ tripId, users }) {
export default function TripMap({ match }) {
    const tripId = match.params.id;
    
    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: process.env.MAP_API
    // });
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
    });
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    
    if (!trip || !events) {
        return <CircularLoading />
    } 
    const users = trip.trip.userTrips;
    
    const [markers, setMarkers] = useState([]);
    const [trackingMarkers, setTrackingMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [update, setUpdate] = useState(0);
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(tripZoom);
    }, []);
    
    useEffect(() => {
        
        setMarkers(prevMarkers => []);
        setTrackingMarkers(prevTrackingMarkers => []);

        // navigator.geolocation.getCurrentPosition(
        //     async (position) => {
        //       dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date()}));
        //       setTrackingMarkers([...trackingMarkers, { key: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, name: auth.username, time: format(new Date(), 'Pp') }]);
        //     panTo({
        //       lat: position.coords.latitude,
        //       lng: position.coords.longitude,
        //   });
        //   },
        //   () => null
        // );
        events.forEach(event => {
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id, id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} - ${event.location}`, location: event.location, url: `/pin-10.svg` }])
        });

        users.forEach(user => {
            if (user.user.lat) {
                setTrackingMarkers(prevTrackingMarkers => [...prevTrackingMarkers, { name: user.user.username, time: format(parseISO(user.user.time), 'Pp'), key: user.userId, id: user.userId, lat: +user.user.lat, lng: +user.user.lng, avatar: user.user.avatar ? user.user.avatar : '/images/person.jpg', firstName: user.user.firstName, lastName: user.user.lastName  }])
            }
        })
        // users.forEach(user => {
        //     setTrackingMarkers(prevTrackingMarkers => [...prevTrackingMarkers, { name: user.user.username, time: format(parseISO(user.user.time), 'Pp'), key: user.userId, id: user.userId, lat: +user.user.lat, lng: +user.user.lng }])
        // })
        
    }, [tripId, update])



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
    
    const userLocation = useRef(null);
    const [status, setStatus] = useState('initial')
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
                // console.log(usersMarker)
                usersMarker = { ...usersMarker, key: usersMarker.key + 1, lat: position.coords.latitude, lng: position.coords.longitude, time: format(new Date(), 'Pp') };
                const otherUsersMarkers = trackingMarkers.filter(m => m.id !== auth.id);
                // console.log(usersMarker)
                await setTrackingMarkers([...otherUsersMarkers, usersMarker]);
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
        //     await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date() }));
        //     setTrackingMarkers([...trackingMarkers, { key: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, name: auth.username, time: format(new Date(), 'Pp') }]);
        // })
        setOpenAlert(true);
    }
    function Locate({ panTo }) {
        return (

            <Button
                startIcon={<MyLocationIcon />}
                variant='outlined'
                className="locate"
                //TODO: USE WATCH POSITION AND SET TIMEOUT LATER TO CONTINUALLY UPDATE POSITION
                onClick={handleLocate}
            >
                Pin My Location
            </Button>
        );
    }

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
    const handleClick2 = async(id, username) => {
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

    // if (!trip || !isLoaded) return <CircularLoading />
    // if (loadError) return "Error";
    // if (!trip) return <CircularLoading />
    // if (!trip || !events || !users) {
    //     return <CircularLoading />
    // } 

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

            <Snackbar open={openAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
                    Location Pinned!
                </Alert>
            </Snackbar>
            <Snackbar open={openNoLocationAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='info' sx={{ width: '100%' }}>
                    {selectedUser} is not sharing location.
                </Alert>
            </Snackbar>
            <Dialog open={open} onClose={handleClose}>
                <EventForm trip={trip} event={eventToEdit} handleClose={handleClose} />
            </Dialog>
            {/* <Tooltip title='Add Event'> */}
            <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Box sx={{ color: 'inherit' }} component={Link} to={`/trips/${trip.tripId}`}>
                    <Typography variant='h5'>
                        &nbsp;{trip.trip.name}
                    </Typography>
                </Box>
            </Box>
            <Button startIcon={<AddIcon />} variant='contained' color='info' onClick={() => setOpen(true)}>
                Add Event
            </Button>
            {/* </Tooltip> */}
            <Tooltip title='Refresh Event Markers'>
                <Button startIcon={<RefreshIcon />} variant='contained' color='info' onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())} />
            </Tooltip>

            <Locate panTo={panTo} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Box display='flex' justifyContent='center'>
                        {
                            users.map(user => (
                                
                                    <Box key={user.userId} marginRight={1} display='flex' flexDirection='column' flexWrap='wrap' justifyContent='center' alignItems='center'
                                        sx={{':hover': { boxShadow: (theme) => theme.shadows[5] }}}
                                    >
                                        <Avatar 
                                            sx={{ height: 35, width: 35, m: 1, bgcolor: 'primary.main'}} 
                                            src={user.user.avatar}
                                            onClick={() => handleClick2(user.userId, user.user.username)}
                                            >
                                            {user.user.firstName[0]+user.user.lastName[0]}
                                        </Avatar>
                                        <Typography variant='caption'>
                                            {user.user.username}
                                        </Typography>
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
                        center={{ lat: +trip.trip.lat, lng: +trip.trip.lng }}
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
                                    <div style={{ margin: '0 1rem .5rem 1rem' }}>
                                        <Typography variant={'subtitle1'}>
                                            {selected.name}
                                        </Typography>
                                        <Typography variant={'caption'}>
                                            {selected.time}
                                        </Typography>
                                    </div>
                                </InfoWindow>
                            )
                                : null
                        }
                    </GoogleMap>
                    <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                    {
                        events.map(event => (
                            <Card className='card' key={event.id} sx={{ minWidth: '100%', mb: 1, mt: 1 }}

                            >
                                <CardContent sx={{ mb: 0 }} onClick={() => handleClick(event.id)}>
                                    <Typography gutterBottom>
                                        {event.name} - {event.location}
                                    </Typography>
                                    <Typography color="text.secondary" variant="subtitle2" sx={{ mb: 0 }}>
                                        {format(parseISO(event.startTime), 'Pp')}
                                    </Typography>
                                </CardContent>
                                {/* <CardActionArea> */}
                                <Button startIcon={<ModeEditIcon />} color='info' onClick={() => {
                                    setEventToEdit(event);
                                    setOpen(true);
                                }}>
                                    Edit
                                </Button>
                                <Button startIcon={<DeleteForeverIcon />} color='error' onClick={async () => {
                                    try {
                                        await dispatch(deleteEvent(event.id))
                                    } catch (err) {
                                        console.log(err)
                                    }
                                }}>
                                    Delete
                                </Button>
                                {/* </CardActionArea> */}
                            </Card>
                        ))
                    }
                </Box>
                
            </div>
        </>
    );
}

// <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
//                         {
//                             users.map(user => (
//                                 <Card className='card' key={user.userId} sx={{ minWidth: '100%', mb: 1, mt: 1 }}

//                                 >
//                                     <CardContent sx={{ mb: 0 }} onClick={() => handleClick2(user.userId, user.user.username)}>
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
