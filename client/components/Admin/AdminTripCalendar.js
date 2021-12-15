import React, { useState } from 'react'

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
import { Box } from '@mui/system'
import { FormControlLabel, FormGroup, Switch } from '@mui/material'



const AdminTripCalendar = () => {
    const theme = useTheme()
    const [checked, setchecked] = useState(false)
    const { adminTrips } = useSelector(state => state)
    
    const handleCheked = (evt) => {
        setchecked(evt.target.checked)
    }

    if (!adminTrips) {
        return (
            <CircularLoading />
        )
    }

    let filteredTrips;
    if (checked) {
        const closeTrips = adminTrips.filter(trip => !trip.isOpen)
        filteredTrips = closeTrips
    }
    else {
        const openTrips = adminTrips.filter(trip => trip.isOpen)
        filteredTrips = openTrips
    }

    ///////////// TRIPS ////////////////
    const calendarTrips = filteredTrips.map(trip => { return { id: trip.id, tripId: trip.id, title: trip.name, start: new Date(trip.startTime), end: new Date(trip.endTime) } })

    ////////// EVENTS ////////////////
    const events = filteredTrips.map(trip => (trip.events)).flat()
    const calendarEvents = events.map(adminEvent => { return { type: 'event', id: adminEvent.id, tripId: adminEvent.tripId, title: adminEvent.name, start: new Date(adminEvent.startTime), end: new Date(adminEvent.endTime) } })

    const handleSelect = (event) => {
        history.push(`/admin/admintrips/${event.tripId}`)
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

export default AdminTripCalendar
