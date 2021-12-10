import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
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

const AdminSingleTripCalendar = ({ match }) => {
    let trip = useSelector(state => state.adminTrips.find(adminTrip => adminTrip.id === match.params.id))
    
    ////////// DIALOG TO OPEN EVENT FORM ////////////////
    const [open, setOpen] = useState(false);
    const [tripEvent, setTripEvent] = useState({});
    
    if (!trip) {
        return (
            <CircularLoading />
            )
        }

    const calendarTrip = { ...trip, isTrip: true, id: trip.id, tripId: trip.id, title: `${trip.name} - ${trip.location}`, start: new Date(trip.startTime), end: new Date(trip.endTime) } 

    ////////// EVENTS ////////////////
    const calendarEvents = trip.events.map(event => { return { ...event, isTrip: false, title: `${event.name} - ${event.location}`, start: new Date(event.startTime), end: new Date(event.endTime) } })

    

    const handleSelect = (event) => {
        
        if (!event.trip){ //event is actual event, not trip
            setTripEvent(() => event);
            setOpen(() => true);
        }
    }
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} event={tripEvent} />
            </Dialog>
            <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Box sx={{ color: 'inherit' }} component={Link} to={`/admin/admintrips/${trip.id}`}>
                    <Typography variant='h5'>
                        &nbsp;{trip.name}
                    </Typography>
                </Box>
            </Box>
            <Calendar
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

export default AdminSingleTripCalendar