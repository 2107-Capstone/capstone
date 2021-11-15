import { Map, GoogleApiWrapper } from 'google-maps-react';
import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const mapStyles = {
    width: '60%',
    height: '60%',
}

const TripMap = (props) => {
    const id = +props.match.params.id

    const auth = useSelector(state => state.auth);
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));
    let events = useSelector(state => state.events.filter(event => event.tripId === id));
    
    if (!trip) return '...loading'
    
    return (
        <Map
        google={props.google}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat: trip.trip.lat, lng: trip.trip.lng}}
      />
      )
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA' })(TripMap);