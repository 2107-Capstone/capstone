import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import {parseISO, format } from 'date-fns';
import { Box, Grid, Button, TextField, Typography, Dialog } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import AddEvent from './AddEvent'
import CircularLoading from '../Loading/CircularLoading'

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

// import config from '../../../config'

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

export default function TripMap ({tripId}) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: ENV['api_key']
    });

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
        events.forEach(event => {
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id + Math.random().toString(16), id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} - ${event.location}` , location: event.location, url: urls[9] }])
        });
//TODO: set tracking markers for users in this trip
    } ,[tripId, update])
    
//TODO: Add form to add new event after clicking on map and getting lat/lng

    const urls = {
        0: `http://labs.google.com/ridefinder/images/mm_20_green.png`,
        1: `http://labs.google.com/ridefinder/images/mm_20_blue.png`,
        2: `http://labs.google.com/ridefinder/images/mm_20_purple.png`,
        3: `http://labs.google.com/ridefinder/images/mm_20_yellow.png`,
        4: `http://labs.google.com/ridefinder/images/mm_20_orange.png`,
        5: `http://labs.google.com/ridefinder/images/mm_20_white.png`,
        6: `http://labs.google.com/ridefinder/images/mm_20_black.png`,
        7: `http://labs.google.com/ridefinder/images/mm_20_gray.png`,
        8: `http://labs.google.com/ridefinder/images/mm_20_brown.png`,
        9: `http://labs.google.com/ridefinder/images/mm_20_red.png`,
    }

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
                        url: `http://labs.google.com/mapfiles/kml/pal3/icon32.png`,
                        // origin: new window.google.maps.Point(0, 0),
                        // anchor: new window.google.maps.Point(10, 10),
                        // scaledSize: new window.google.maps.Size(20, 20),
                    }}
                />
            )
        })
    }
    function Locate({ panTo }) {
        return (
          <Button
            variant='outlined'
            className="locate"
            onClick={() => {
//TODO: USE WATCH POSITION AND SET TIMEOUT LATER TO CONTINUALLY UPDATE POSITION
              navigator.geolocation.getCurrentPosition(
                (position) => {
                    setTrackingMarkers([...trackingMarkers, { key: auth.id, lat: position.coords.latitude, lng: position.coords.longitude, name: auth.username, time: format(new Date(), 'Pp') }]);
//TODO: UPDATE USER WITH NEW COORDINATES
                  panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                },
                () => null
              );
            }}
          >
            Where Am I?
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
            <Button variant='contained' onClick={() => setOpen(true)}>
                Add Event
            </Button>
        </>
    )
    
    return (
        <>
                <Dialog open={open} onClose={handleClose}>
                    <AddEvent trip={trip} handleClose={handleClose}/>
                </Dialog>
            
                <Button variant='contained' onClick={() => setOpen(true)}>
                    Add Event
                </Button>
             
                <Button variant='outlined' onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}>Refresh Event Markers</Button>
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

