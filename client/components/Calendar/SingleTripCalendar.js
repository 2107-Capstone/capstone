import React from 'react'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

////////// Browser History ///////////////
import history from '../../history'

////////// CSS Style for the calendar //////////
import './TripCalendar.css'
import { useSelector } from 'react-redux'
import CircularLoading from '../Loading/CircularLoading'


const SingleTripCalendar = ({ trip }) => {
    // const { trips, events } = useSelector(state => state)

    if (!trip.id) {
        return (
            <CircularLoading />
        )
    }

    ///////////// TRIPS ////////////////
    // const trip = (trips.find(t => t.tripId === match.params.id)).trip;
    // console.log(trip)
    const calendarTrip = { id: trip.id, tripId: trip.id, title: trip.name, start: new Date(trip.startTime), end: new Date(trip.endTime) } 

    ////////// EVENTS ////////////////
    const calendarEvents = trip.events.map(event => { return { id: event.id, tripId: event.tripId, title: event.name, start: new Date(event.startTime), end: new Date(event.endTime) } })

    const handleSelect = (event) => {
        history.push(`/trip/${event.tripId}`)
    }

    return (
        <div>
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
