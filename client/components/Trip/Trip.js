import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import TripMap from '../Map/TripMap'
import { Participants, Events, Expenses } from './tripInfo'

const Trip = (props) => {

    const id = +props.match.params.id

    const auth = useSelector(state => state.auth);
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));

    //TODO: why does    trip = trip.trip    not allow refresh?

    // console.log('TRIPPPPPPPPPPPPP', trip)           
    if (!trip) return '...loading'
    return (
        <>
            <h2>{trip.trip.name}</h2>
            <h3>Friends in Trip</h3>
            <Participants trip={trip} auth={auth} />
            <h3>Events in Trip</h3>
            <Events tripId={id} />
            <h3>Expenses in Trip</h3>
            <Expenses tripId={id} />
            <Link key={trip.tripId + Math.random().toString(16)} to={`/trip/${trip.tripId}/chat`}>
                Chat
            </Link>
            {/* <Link key={trip.id + Math.random().toString(16)} to={`/trip/${trip.tripId}/map`}>
                Map
            </Link> */}
            <TripMap tripId={id} />
        </>
    )
}
export default Trip;