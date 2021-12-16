import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

//////////////// REDUX STORE ///////////////////////
import { addEvent, getTrips, editEvent } from '../../store'

//////////////// STYLE FOR GOOGLE AUTOCOMPLETE ///////////////////
// import './style.css'

////////////// MATERIAL UI ///////////////////////////////
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Grid, Button, TextField, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaidIcon from '@mui/icons-material/Paid';
import { format, parseISO, isAfter } from "date-fns";

import CircularLoading from '../Loading/CircularLoading'

const EventForm = (props) => {
    const { trip, handleClose, setUpdate } = props
    const event = props.event || {}
    const dispatch = useDispatch()

    const [inputs, setInputs] = useState({
        id: event.id || '',
        name: event.name || '',
        location: event.location || '',
        description: event.description || '',
        error: '',
    })

    const [startTime, setStartTime] = useState(event.startTime || new Date(trip.trip.startTime));
    const [endTime, setEndTime] = useState(event.endTime || new Date(trip.trip.endTime));

    let googlePlace;
//TODO: Add trip location with search??
    // let googlePlace = inputs.location + trip.trip.location;
    useEffect(async () => {
        const autocomplete = await new google.maps.places.Autocomplete(googlePlace)
        googlePlace.value = inputs.location

        autocomplete.addListener("place_changed", (evt) => {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
                setInputs(inputs => ({ ...inputs, location: place.formatted_address }))
            }
            else {
                setInputs(inputs => ({ ...inputs, location: place.name }))
            }
        })
    }, [])

    const handleStartChange = (start) => {
        setStartTime(start)
    }

    const handleEndChange = (end) => {
        setEndTime(end)
    }

    const handleChange = (ev) => {
        console.log("testing")
        const name = ev.target.name;
        const value = ev.target.value

        setInputs({ ...inputs, [name]: value })
    }

    const hasErrors = () => {
        if (isAfter(new Date(trip.trip.startTime), new Date(startTime)) || isAfter(new Date(endTime), new Date(trip.trip.endTime))){
            setInputs({ ...inputs, error: 'Event must be within the trip period.'})
            return true;
        } else if (isAfter(new Date(startTime), new Date(endTime))){
            setInputs({ ...inputs, error: 'End time must be after start time.'})
            return true;
        }
        return false;
    }
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (hasErrors()) {
            return
        }
        try {
            if (event.id) {
                await dispatch(editEvent({ ...inputs, trip, startTime, endTime }))
                await dispatch(getTrips())
                setUpdate(prevUpdate => prevUpdate + Math.random())
            }
            else {
                await dispatch(addEvent({ ...inputs, trip, startTime, endTime }))
                setUpdate(prevUpdate => prevUpdate + Math.random())
            }
            handleClose();
        }
        catch (err) {
            console.log(err)
        }
    }

    if (!trip) {
        return (
            <CircularLoading />
        )
    }

    return (
        <>
            <CloseIcon onClick={handleClose} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <EventIcon fontSize='medium' />
                <Typography variant='h5'>
                    &nbsp;{!event.id ? ("Add Event") : ("Edit Event")}
                </Typography>
            </Box>
            <Box component="form" sx={{ m: 3 }} onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="name"
                            required
                            fullWidth
                            id="name"
                            label="Event Name"
                            value={inputs.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="location"
                            label="Location"
                            name="location"
                            inputRef={ref => googlePlace = ref}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            fullWidth
                            id="description"
                            label="Description"
                            value={inputs.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={12} sm={6}>
                            <DateTimePicker
                                label="Start Time"
                                name='startTime'
                                value={startTime}
                                onChange={handleStartChange}
                                minDate={new Date(trip.trip.startTime)}
                                maxDate={new Date(trip.trip.endTime)}
                                minutesStep={5}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DateTimePicker
                                label="End Time"
                                name='endTime'
                                value={endTime}
                                onChange={handleEndChange}
                                minDate={new Date(startTime)}
                                maxDate={new Date(trip.trip.endTime)}
                                minutesStep={5}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </LocalizationProvider>
                    <Box fullWidth sx={{ml: 1, mt: 1, textAlign: 'center'}}>
                        <Typography variant='caption' sx={{color: 'red'}}>
                            {inputs.error}
                        </Typography>
                    </Box>
                    <Button
                        fullWidth
                        type='submit'
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}                        
                    >
                        {!event.id ? ("Add Event") : ("Edit Event")}
                    </Button>
                </Grid>
            </Box>
        </>
    )
}
export default EventForm;
