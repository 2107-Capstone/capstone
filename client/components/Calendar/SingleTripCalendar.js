import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
const localizer = momentLocalizer(moment)

////////// Icons ///////////////
import CardTravelIcon from '@mui/icons-material/CardTravel';
import AddIcon from '@mui/icons-material/Add';

////////// MUI //////////
import { Button, Dialog, Typography } from '@mui/material'
import { Box } from '@mui/system'
////////// Components //////////
import EventForm from '../Map/EventForm';
import AddTripForm from '../Trips/Form/AddTripForm';
import { TripTitle } from '../Trip/TripComponents';
import CircularLoading from '../Loading/CircularLoading'

import { useTheme } from '@emotion/react'

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

    if (!trip || !events) {
        return (
            <CircularLoading />
        )
    }
    ///////////// TRIP ////////////////
    const calendarTrip = { ...trip.trip, title: `${trip.trip.name} - ${trip.trip.location}`, start: new Date(trip.trip.startTime), end: new Date(trip.trip.endTime), isTrip: true }
    
    ////////// EVENTS ////////////////
    const calendarEvents = events.map(event => { return { ...event, type: 'event', isTrip: false, title: `${event.name} - ${event.location}`, start: event.startTime, end: event.endTime } })

    return (
        <Box>
            <Dialog open={open && form === 'event'} onClose={handleClose}>
                <EventForm trip={trip} handleClose={handleClose} event={tripEvent} />
            </Dialog>
            <Dialog open={open && form === 'trip'} onClose={handleClose}>
                <AddTripForm trip={trip} handleClose={handleClose} />
            </Dialog>
            <TripTitle trip={trip} />
            {
                trip.trip.isOpen ?
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
                defaultDate={calendarTrip.start}
                showMultiDayTimes
                onSelectEvent={event => handleSelect(event)}
                eventPropGetter={eventStyles}
            />
        </Box>
    )
}

export default SingleTripCalendar
