import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import TripMap from '../Map/TripMap'
import { Participants, Events, Expenses } from './tripInfo'

import { addEvent } from '../../store/events'
import { useDispatch } from 'react-redux'

const Trip = (props) => {

    const id = +props.match.params.id

    const auth = useSelector(state => state.auth);
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));

    //TODO: why does    trip = trip.trip    not allow refresh?
    // console.log('TRIPPPPPPPPPPPPP', trip)           

//ADD EVENT
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({
        eventName: '',
        location: '',
        description: '',
        
    })
    const { eventName, location, description,  } = inputs;

    const handleChange = (ev) => {
        const change = {};
        change[ev.target.name] = ev.target.value;
        setInputs({eventName, location, description, ...change })
    }
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            await dispatch(addEvent({name: eventName, location, description, trip }));
            setInputs({ eventName: '', location: '', description: ''})
        }
        catch(err){
            console.log(err)
        }
    }
//
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
            <form onSubmit={handleSubmit}>
                <label>
                Event Name:
                <input type="text" name='eventName' value={eventName} onChange={handleChange} />
                </label>
                <label>
                Location:
                <input type="text" name='location' value={location} onChange={handleChange} />
                </label>
                <label>
                Description:
                <input type="text" name='description' value={description} onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {/* <button>Add Event</button> */}
            {/* <Link key={trip.id + Math.random().toString(16)} to={`/trip/${trip.tripId}/map`}>
                Map
            </Link> */}
            <TripMap tripId={id} />
        </>
    )
}
export default Trip;