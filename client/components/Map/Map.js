import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
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
    
    const displayMarkers = () => {
        return events.map((event, idx) => {
            return <Marker 
                        key={idx} 
                        id={idx} 
                        position={{
                            lat: event.lat,
                            lng: event.lng
                        }}
                        name={event.name + event.location}
                        // onClick={}
                    />
        })
    }

    if (!trip) return '...loading'
    
    return (
        
        <Map
            google={props.google}
            zoom={8}
            style={mapStyles}
            initialCenter={{ lat: trip.trip.lat, lng: trip.trip.lng}}
        >
            {displayMarkers()}
            {
                events.map(event => {
                    console.log(event)
                    return (
                        <Marker 
                            key={event.id}
                            position={{
                                lat: event.lat,
                                lng: event.lng
                            }}
                            name={`${event.name} at ${event.location}`}
                        />
                    )
                })
            }
            
        </Map>
      )
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA' })(TripMap);