import React from 'react'
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

////////// MUI ///////////////
import { Box, Typography } from '@mui/material'
import CardTravelIcon from '@mui/icons-material/CardTravel';

////////// Browser History ///////////////
import history from '../../history'

////////// CSS Style for the calendar //////////
import './TripCalendar.css'
import { useSelector } from 'react-redux'
import CircularLoading from '../Loading/CircularLoading'


const SingleTripCalendar = ({ match }) => {
    
    let trip = useSelector(state => state.trips.find(trip => trip.tripId === +match.params.id))
    
    if (!trip) {
        return (
            <CircularLoading />
            )
        }
    console.log(trip)
    ///////////// TRIP ////////////////
    trip = trip.trip;
    const calendarTrip = { id: trip.id, tripId: trip.id, title: `${trip.name} - ${trip.location}`, start: new Date(trip.startTime), end: new Date(trip.endTime) } 

    ////////// EVENTS ////////////////
    const calendarEvents = trip.events.map(event => { return { id: event.id, tripId: event.tripId, title: `${event.name} - ${event.location}`, start: new Date(event.startTime), end: new Date(event.endTime) } })

    const handleSelect = (event) => {
        history.push(`/trip/${event.tripId}`)
    }

    return (
        <div>
            <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Box sx={{ color: 'inherit' }} component={Link} to={`/trip/${trip.id}`}>
                    <Typography variant='h5'>
                        &nbsp;{trip.name}
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
