import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
const localizer = momentLocalizer(moment)

import EventForm from '../Map/EventForm';
import { updateUser, deleteEvent, editEvent } from '../../store';
////////// MUI ///////////////
import { Box, Dialog, Typography } from '@mui/material'
import CardTravelIcon from '@mui/icons-material/CardTravel';

////////// Browser History ///////////////
import history from '../../history'

////////// CSS Style for the calendar //////////
import './TripCalendar.css'
import CircularLoading from '../Loading/CircularLoading'

const SingleTripCalendar = ({ match }) => {
    let trip = useSelector(state => state.trips.find(trip => trip.tripId === +match.params.id))
    
    if (!trip) {
        return (
            <CircularLoading />
            )
        }
//TODO: have event info refresh on edit
//TODO: not be able to edit Trip from here
    ///////////// TRIP ////////////////
    // trip = trip.trip;
    // const calendarTrip = { isTrip: true, id: trip.id, tripId: trip.id, name: trip.name, description: trip.description, location: trip.location, title: `${trip.name} - ${trip.location}`, start: new Date(trip.startTime), end: new Date(trip.endTime) } 
    const calendarTrip = { ...trip.trip, isTrip: true, id: trip.tripId, tripId: trip.tripId, title: `${trip.trip.name} - ${trip.trip.location}`, start: new Date(trip.trip.startTime), end: new Date(trip.trip.endTime) } 

    ////////// EVENTS ////////////////
    const calendarEvents = trip.trip.events.map(event => { return { ...event, isTrip: false, title: `${event.name} - ${event.location}`, start: new Date(event.startTime), end: new Date(event.endTime) } })

    ////////// DIALOG TO OPEN EVENT FORM ////////////////
    const [open, setOpen] = useState(false);
    const [tripEvent, setTripEvent] = useState({});

    const handleSelect = (event) => {
        
        if (!event.trip){ //event is actual event, not trip
            setTripEvent(() => event);
            setOpen(() => true);
        }
    }
    const handleClose = () => {
        setOpen(false);
    }
    const dispatch = useDispatch();
    // const handleSubmitToPassToForm = async (ev, inputs, trip, startTime, endTime) => {
    //     ev.preventDefault();
    //     try {
    //         await dispatch(editEvent({ ...inputs, trip, startTime, endTime }))
    //         handleClose();
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} event={tripEvent} />
            </Dialog>
            <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Box sx={{ color: 'inherit' }} component={Link} to={`/trips/${trip.tripId}`}>
                    <Typography variant='h5'>
                        &nbsp;{trip.trip.name}
                    </Typography>
                </Box>
            </Box>
            <Calendar
                // popup
                // views={{
                //     month: true,
                //     week: true,

                // }}
                // selectable
                localizer={localizer}
                events={[calendarTrip, ...calendarEvents]}
                step={60}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                defaultDate={new Date()}
                showMultiDayTimes
                onSelectEvent={event => handleSelect(event)}
            />
        </div>
    )
}

export default SingleTripCalendar
