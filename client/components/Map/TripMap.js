import React, { useEffect, useState } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import {parseISO, format } from 'date-fns';
import { Box, Grid, Button, TextField, Tooltip, Typography, Dialog } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import AddEvent from './AddEvent'
import CircularLoading from '../Loading/CircularLoading'
import { updateUser } from '../../store';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { position } from 'dom-helpers';
//TODO: switch to using markers instead of events in events list?
const mapStyles = {
    width: '60%',
    height: '60%',
}
const mapContainerStyle = {
    height: "50vh",
    width: "50vw",
  };

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};
const tripZoom = 12;

export default function TripMap ({tripId, users}) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA'
    });
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    
    let trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    let events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    

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
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id + Math.random().toString(16), id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} - ${event.location}` , location: event.location, url: `/pin-10.svg` }])
        });
        users.forEach(user => {
            setTrackingMarkers(prevTrackingMarkers => [...prevTrackingMarkers, { name: user.user.username, time: user.user.time, key: user.userId + Math.random().toString(16), id: user.userId, lat: +user.user.lat, lng: +user.user.lng }])
        })
//TODO: set tracking markers for users in this trip
    } ,[tripId, update])
    
//TODO: Add form to add new event after clicking on map and getting lat/lng



    const displayMarkers = () => {
     console.log('markers', markers)
        return markers.map((marker) => {
            return (
                <Marker 
                    key={marker.key} 
                    id={marker.id} 
                    position={{lat: marker.lat, lng: marker.lng}}
                    name={marker.name}
                    icon={{ url: marker.url }}
                    onClick={() => {setSelected(marker)}}
                />
            )
        })
    }
    const displayTrackingMarkers = () => {
     console.log('trackingmarkers', trackingMarkers)
        return trackingMarkers.map((marker) => {
            return (
                <Marker 
                    key={marker.key} 
                    id={marker.id} 
                    position={{lat: marker.lat, lng: marker.lng}}
                    name={marker.name}
                    onClick={() => {setSelected(marker)}}
                    icon={{
                        url: '/search-people.svg',
                        color: 'green'
                    }}
                    
                    // icon={{
                    //     // url: `http://google.com/mapfiles/ms/micons/man.png`
                    //     url: `http://labs.google.com/mapfiles/kml/pal4/icon20.png`,
                    //     // origin: new window.google.maps.Point(0, 0),
                    //     // anchor: new window.google.maps.Point(10, 10),
                    //     // scaledSize: new window.google.maps.Size(20, 20),
                    // }}
                />
            )
        })
    }
    function Locate({ panTo }) {
        return (
          <Button
            variant='outlined'
            className="locate"
            //TODO: USE WATCH POSITION AND SET TIMEOUT LATER TO CONTINUALLY UPDATE POSITION
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    await dispatch(updateUser({ id: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, time: new Date()}));
                    setTrackingMarkers([...trackingMarkers, { key: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, name: auth.username, time: format(new Date(), 'Pp') }]);
                  panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                },
                () => null
              );
            }}
          >
            Set My Location
          </Button>
        );
      }

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        setUpdate(prevUpdate => prevUpdate + Math.random())
    }

    const handleClick = (id) => {
        setUpdate(prevUpdate => prevUpdate + Math.random())
        const marker = markers.find(marker => marker.id === id);
        // ev.stopPropagation()
        setSelected(marker);
    }

    if (!trip || !isLoaded) return <CircularLoading />
    if (loadError) return "Error";
    
    if (trip && events.length === 0) return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <AddEvent trip={trip} handleClose={handleClose}/>
            </Dialog>
            <Button startIcon={<AddAlarmIcon />} variant='contained' color='info' onClick={() => setOpen(true)}>
                Add Event
            </Button>
        </>
    )
    
    return (
        <>
                <Dialog open={open} onClose={handleClose}>
                    <AddEvent trip={trip} handleClose={handleClose}/>
                </Dialog>
                {/* <Tooltip title='Add Event'> */}
                    <Button startIcon={<AddAlarmIcon />} variant='contained' color='info' onClick={() => setOpen(true)}>
                        Add Event
                    </Button>
                {/* </Tooltip> */}
                <Tooltip title='Refresh Event Markers'>
                    <Button startIcon={<RefreshIcon />} variant='contained' color='info' onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}/>
                </Tooltip>
                
                <Locate panTo={panTo} />
        <div style={{display: 'flex'}}>
            <div>
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
                    {displayMarkers()}
                    {displayTrackingMarkers()}

                    {
                        selected ? (
                            <InfoWindow 
                            open={open}
                            position={{lat: +selected.lat, lng: +selected.lng}}
                            onCloseClick={() => {
                                setSelected(null);
                            }}
                            >
                        <div style={{margin: '0 1rem .5rem 1rem'}}>
                            <Typography  variant={'subtitle1'}>
                                {selected.name}
                            </Typography>
                            <Typography  variant={'caption'}>
                                {selected.time}
                            </Typography>
                        </div>
                    </InfoWindow>)
                    : null
                }
                </GoogleMap>
            </div>
            <Box sx={{maxHeight: 500, overflow: 'auto'}}>
                {
                    events.map(event => (
                        <Card className='card' key={event.id + Math.random().toFixed(2)} sx={{ minWidth: '100%', mb: 1, mt: 1, height: '20%' }}
                            style={{}}
                        >
                            <CardContent sx={{ mb: 0}} onClick={() => handleClick(event.id)}>
                                <Typography  gutterBottom>
                                {event.name} - {event.location}
                                </Typography>
                                <Typography color="text.secondary" variant="subtitle2" sx={{ mb: 0}}>
                                    {format(parseISO(event.startTime), 'Pp')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                }
            </Box>
        </div>
        </>
    );
}

