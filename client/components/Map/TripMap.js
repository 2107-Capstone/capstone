// import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {parseISO, formatRelative, format } from 'date-fns';
import { addEvent } from '../../store/events';
import { useDispatch } from 'react-redux';

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
    
    const auth = useSelector(state => state.auth);
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
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
        mapRef.current.setZoom(8);
    }, []);

    useEffect(() => {
        setMarkers(prevMarkers => []);
        events.forEach(event => {
            setMarkers(prevMarkers => [...prevMarkers, { time: format(parseISO(event.startTime), 'Pp'), key: event.id + Math.random().toString(16), id: event.id, lat: +event.lat, lng: +event.lng, name: `${event.name} at ${event.location}`}])
        });
//TODO: set tracking markers for users in this trip
    } ,[tripId, update])
    
    const [inputs, setInputs] = useState({
        name: '',
        location: '',
        description: '',
        startTime: '',
        endTime: ''
    });
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
                        url: `/person.svg`,
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(10, 10),
                        scaledSize: new window.google.maps.Size(20, 20),
                    }}
                />
            )
        })
    }
    function Locate({ panTo }) {
        return (
          <button
            className="locate"
            onClick={() => {
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
          </button>
        );
      }
  console.log(selected)
    if (!trip) return '...loading'
    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";
    return (
        <div>

        <button onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())}>Refresh Event Markers</button>
        <Locate panTo={panTo} />
        <GoogleMap
            id='map'
            options={options}
            onLoad={onMapLoad}
            zoom={8}
            mapContainerStyle={mapContainerStyle}
            style={mapStyles}
            center={{ lat: +trip.trip.lat, lng: +trip.trip.lng}}
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