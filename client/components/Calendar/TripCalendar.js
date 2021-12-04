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


const TripCalendar = () => {
    const { trips, events } = useSelector(state => state)

    if (!trips || !events) {
        return (
            <CircularLoading />
        )
    }

    ///////////// TRIPS ////////////////
    const userTrips = trips.map(trip => trip.trip)
    const calendarTrips = userTrips.map(trip => { return { id: trip.id, tripId: trip.id, title: trip.name, start: new Date(trip.startTime), end: new Date(trip.endTime) } })

    ////////// EVENTS ////////////////
    const calendarEvents = events.map(event => { return { id: event.id, tripId: event.tripId, title: event.name, start: new Date(event.startTime), end: new Date(event.endTime) } })

    const handleSelect = (event) => {
        history.push(`/trips/${event.tripId}`)
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
                events={[...calendarTrips, ...calendarEvents]}
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

export default TripCalendar
