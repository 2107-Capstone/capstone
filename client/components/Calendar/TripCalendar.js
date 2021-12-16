import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

////////// Browser History ///////////////
import history from '../../history'

////////// CSS Style for the calendar //////////
import { useSelector } from 'react-redux'
import CircularLoading from '../Loading/CircularLoading'
import { useTheme } from '@emotion/react'
import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material'


const TripCalendar = () => {
    const theme = useTheme()
    const [checked, setchecked] = useState(false)
    const { trips } = useSelector(state => state)

    const handleCheked = (evt) => {
        setchecked(evt.target.checked)
    }

    if (!trips) {
        return (
            <CircularLoading />
        )
    }

    const userTrips = trips.map(trip => trip.trip)

    let filteredTrips;
    if (checked) {
        const closeTrips = userTrips.filter(trip => !trip.isOpen)
        filteredTrips = closeTrips
    }
    else {
        const openTrips = userTrips.filter(trip => trip.isOpen)
        filteredTrips = openTrips
    }

    ///////////// TRIPS ////////////////
    const calendarTrips = filteredTrips.map(trip => { return { id: trip.id, tripId: trip.id, title: trip.name, start: new Date(trip.startTime), end: new Date(trip.endTime) } })

    ////////// EVENTS ////////////////
    const events = filteredTrips.map(trip => (trip.events)).flat()
    const calendarEvents = events.map(event => { return { type: 'event', id: event.id, tripId: event.tripId, title: event.name, start: new Date(event.startTime), end: new Date(event.endTime) } })
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
        <Box>
            <FormGroup>
                <FormControlLabel control={<Switch checked={checked} onChange={handleCheked} />} label="Closed Trips" />
            </FormGroup>

            <Calendar
                views={{
                    month: true,
                    // week: true,
                    agenda: true

                }}
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
        </Box>
    )
}

export default TripCalendar
