import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import {parseISO, format } from 'date-fns';
import { Box, Grid, Button, TextField, Dialog } from '@mui/material'
import AddEvent from './AddEvent'

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
  } from "@react-google-maps/api";
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

export default function TripMap ({tripId}) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA'
    });
    let trip, trips, events, tripIdsMap;

    const auth = useSelector(state => state.auth);
    
    if(tripId){
        trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
        events = useSelector(state => state.events.filter(event => event.tripId === tripId));
    } else {
        trips = useSelector(state => state.trips);
        tripIdsMap = trips.map(trip => trip.tripId);
        events = useSelector(state => state.events);
        tripIdsMap.forEach((id, idx) => {
            events.forEach(ev => {
                ev.tripId === id ? ev.group = idx : ''
            })
        })
    }
    console.log('EVENTS AFTER IDS', events)

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
        mapRef.current.setZoom(12);
    }, []);

    useEffect(() => {
        setMarkers(prevMarkers => []);
        events.forEach(event => {
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id + Math.random().toString(16), id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} at ${event.location}`, url: tripId ?urls[9] : event.group > 9 ? urls[event.group % 9] : urls[event.group]}])
        });
//TODO: set tracking markers for users in this trip
    } ,[tripId, update])
    
//TODO: Add form to add new event after clicking on map and getting lat/lng

    // const base = `http://labs.google.com/ridefinder/images/mm_20_${color[group]}.png`
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
  console.log(selected)

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }
    // if (!trip) return '...loading'
    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";
    return (
        <div>
            <Dialog open={open}>
                <AddEvent trip={trip} handleClose={handleClose}/>
            </Dialog>
        {
            tripId ? 
                <Button variant='contained' onClick={() => setOpen(true)}>
                    Add Event
                </Button>
            : ''
        }
        <Button variant='outlined' onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}>Refresh Event Markers</Button>
        <Locate panTo={panTo} />
        <GoogleMap
            id='map'
            options={options}
            onLoad={onMapLoad}
            zoom={10}
            // zoom={tripId ? 8 : 3}
            mapContainerStyle={mapContainerStyle}
            style={mapStyles}
            center={tripId ? {lat: +trip.trip.lat, lng: +trip.trip.lng} : {lat: +trips[0].trip.lat, lng: +trips[0].trip.lng }}
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
                <div>
                    <h3>
                        {selected.name}
                    </h3>
                    <p>
                        {selected.time}
                    </p>
                </div>
            </InfoWindow>)
            : null
            }
        </GoogleMap>
        </div>
    );
}