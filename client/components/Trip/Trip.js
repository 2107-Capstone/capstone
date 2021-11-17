import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import TripMap from '../Map/TripMap'
import { Participants, Events, Expenses } from './tripInfo'

import { addEvent } from '../../store/events'
import { useDispatch } from 'react-redux'
import AddEvent from '../Map/AddEvent'
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DateTimePicker from '@mui/lab/DateTimePicker';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { TextField } from '@mui/material'

const Trip = (props) => {

    const id = +props.match.params.id

    const auth = useSelector(state => state.auth);
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === id));

    //TODO: why does    trip = trip.trip    not allow refresh?
    // console.log('TRIPPPPPPPPPPPPP', trip)           

//ADD EVENT
    // const dispatch = useDispatch()
    // const [inputs, setInputs] = useState({
    //     eventName: '',
    //     location: '',
    //     description: '',
    //     startTime: new Date(),
    //     endTime: new Date()
        
    // })
    // const [startTime, setStartTime] = useState(new Date());
    // const [endTime, setEndTime] = useState(startTime);

    // const { eventName, location, description  } = inputs;
    
    // const handleStartChange = (newVal) => {
    //     setStartTime(newVal)
    // }
    // const handleEndChange = (newVal) => {
    //     setEndTime(newVal)
    // }
    // const handleChange = (ev) => {
    //     const change = {};
    //     // console.log(ev.target)
    //     change[ev.target.name] = ev.target.value;
    //     setInputs({eventName, location, description, ...change })
    // }
    // const handleSubmit = async (ev) => {
    //     ev.preventDefault();
    //     try {
    //         await dispatch(addEvent({name: eventName, location, description, trip, startTime, endTime }));
    //         setInputs({ eventName: '', location: '', description: '', trip: ''});
    //         setStartTime(new Date());
    //         setEndTime(new Date());
    //     }
    //     catch(err){
    //         console.log(err)
    //     }
    // }
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
            <AddEvent trip={trip} />
            <TripMap tripId={id} />
        </>
    )
}
export default Trip;