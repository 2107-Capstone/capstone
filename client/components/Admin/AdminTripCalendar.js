import React from 'react'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

////////// Browser History ///////////////
import history from '../../history'

////////// CSS Style for the calendar //////////
// import './TripCalendar.css'
import { useSelector } from 'react-redux'
import CircularLoading from '../Loading/CircularLoading'
import { useTheme } from '@emotion/react'



const AdminTripCalendar = () => {
    const { adminTrips, adminEvents } = useSelector(state => state)

    const theme = useTheme()

    if (!adminTrips || !adminEvents) {
        return (
            <CircularLoading />
        )
    }
    ///////////// TRIPS ////////////////

    const calendarTrips = adminTrips.map(trip => { return { id: trip.id, tripId: trip.id, title: trip.name, start: new Date(trip.startTime), end: new Date(trip.endTime) } })

    ////////// EVENTS ////////////////
    const calendarEvents = adminEvents.map(adminEvent => { return { type: 'event', id: adminEvent.id, tripId: adminEvent.tripId, title: adminEvent.name, start: new Date(adminEvent.startTime), end: new Date(adminEvent.endTime) } })

    const handleSelect = (event) => {
        history.push(`/trips/${event.tripId}`)
    }

    const eventStyles = (event) => {
        const style = {
            backgroundColor: theme.palette.primary.main
        }

        if (event.type === 'event') {
            style.backgroundColor = theme.palette.secondary.main
        }
        return { style: style }
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
                eventPropGetter={eventStyles}
            />
        </div>
    )
}

export default AdminTripCalendar
