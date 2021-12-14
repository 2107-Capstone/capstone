import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
const localizer = momentLocalizer(moment)

import EventForm from '../Map/EventForm';
import AddTripForm from '../Trips/Form/AddTripForm';
import { TripTitle } from '../Trip/TripComponents';
////////// MUI ///////////////
import { Box, Button, Dialog, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import CardTravelIcon from '@mui/icons-material/CardTravel';
import AddIcon from '@mui/icons-material/Add';
////////// Browser History ///////////////
import history from '../../history'

////////// CSS Style for the calendar //////////
// import './TripCalendar.css'
import CircularLoading from '../Loading/CircularLoading'

const SingleTripCalendar = ({ match }) => {
    let trip = useSelector(state => state.trips.find(trip => trip.tripId === match.params.id))
    let events = useSelector(state => state.events.filter(event => event.tripId === match.params.id));
    ////////// DIALOG TO OPEN EVENT FORM ////////////////
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState('');
    const [tripEvent, setTripEvent] = useState({});

    const handleSelect = (event) => {
        if (!event.isTrip && trip.trip.isOpen) { //event is actual event, not trip
            setForm('event')
            setTripEvent(() => event);
        } else if (trip.trip.isOpen) {
            setForm('trip')
        }
        setOpen(() => true);
    }
    const handleClose = () => {
        setOpen(false);
        setForm('');
        setTripEvent({})
    }

    const theme = useTheme()
    const eventStyles = (event) => {
        const style = {
            backgroundColor: theme.palette.primary.main
        }

        if (event.type === 'event') {
            style.backgroundColor = theme.palette.secondary.main
        }
        return { style: style }
    }

    if (!trip) {
        return (
            <CircularLoading />
        )
    }
    //TODO: edit trip from here
    ///////////// TRIP ////////////////
    // trip = trip.trip;
    // const calendarTrip = { isTrip: true, id: trip.id, tripId: trip.id, name: trip.name, description: trip.description, location: trip.location, title: `${trip.name} - ${trip.location}`, start: new Date(trip.startTime), end: new Date(trip.endTime) } 
    const calendarTrip = { ...trip.trip, isTrip: true, id: trip.tripId, tripId: trip.tripId, title: `${trip.trip.name} - ${trip.trip.location}`, start: new Date(trip.trip.startTime), end: new Date(trip.trip.endTime) }

    ////////// EVENTS ////////////////
    const calendarEvents = events.map(event => { return { ...event, type: 'event', isTrip: false, title: `${event.name} - ${event.location}`, start: new Date(event.startTime), end: new Date(event.endTime) } })


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
            <Dialog open={open && form === 'event'} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} event={tripEvent} />
            </Dialog>
            <Dialog open={open && form === 'trip'} onClose={handleClose}>
                <AddTripForm trip={trip} handleClose={handleClose} />
            </Dialog>
            <TripTitle trip={trip} />
            {
                trip.trip.isOpen ?
<<<<<<< HEAD
                <Box textAlign='center'>
                    <Button sx={{mb: 1, mt: 1}}  variant='contained' color='primary' fontSize='large' startIcon={<AddIcon />}  onClick={() => {
                        setOpen(true)
                        setForm('event')
                    }} 
                    >
                        Add Event
                    </Button>
                </Box>
                : ''
=======
                    <Box textAlign='center'>
                        <Button sx={{ mb: 1, mt: 1 }} variant='contained' color='primary' fontSize='large' startIcon={<AddIcon />} onClick={() => {
                            setOpen(true)
                            setForm('event')
                        }}
                        >
                            Add Event
                        </Button>
                    </Box>
                    : ''
>>>>>>> main
            }
            <Calendar
                // popup
                views={{
                    month: true,
                    // week: true,
                    agenda: true

                }}
                // selectable
                localizer={localizer}
                events={[calendarTrip, ...calendarEvents]}
                step={60}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                defaultDate={calendarTrip.startTime}
                showMultiDayTimes
                onSelectEvent={event => handleSelect(event)}
                eventPropGetter={eventStyles}
            />
        </div>
    )
}

export default SingleTripCalendar
