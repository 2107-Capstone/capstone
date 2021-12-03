import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

//////////////// REDUX STORE ///////////////////////
import { addEvent, getTrips, editEvent } from '../../store'

//////////////// STYLE FOR GOOGLE AUTOCOMPLETE ///////////////////
import './style.css'

////////////// MATERIAL UI ///////////////////////////////
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Grid, Button, TextField, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CircularLoading from '../Loading/CircularLoading'

const EventForm = (props) => {
    const { trip, handleClose } = props
    const event = props.event || {}

    const dispatch = useDispatch()

    const [inputs, setInputs] = useState({
        id: event.id || '',
        name: event.name || '',
        location: event.location || '',
        description: event.description || '',
    })

    const [startTime, setStartTime] = useState(event.startTime || new Date());
    const [endTime, setEndTime] = useState(event.endTime || startTime);

    let googlePlace;
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

    const handleSubmit = async () => {
        try {
            if (event.id) {
                await dispatch(editEvent({ ...inputs, trip, startTime, endTime }))
            }
            else {
                await dispatch(addEvent({ ...inputs, trip, startTime, endTime }))
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
            <Box component="form" noValidate sx={{ m: 3 }} >
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
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DateTimePicker
                                label="End Time"
                                name='endTime'
                                value={endTime}
                                onChange={handleEndChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </LocalizationProvider>
                    <Button
                        fullWidth
                        onClick={handleSubmit}
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
