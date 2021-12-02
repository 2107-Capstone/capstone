import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

//////////////// REDUX STORE ///////////////////////
import { addEvent, getTrips, editEvent } from '../../store'

////////////// MATERIAL UI ///////////////////////////////
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Grid, Button, TextField } from '@mui/material'
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
        place_id: event.place_id || ''
    })
    
    const [startTime, setStartTime] = useState(event.startTime || new Date());
    const [endTime, setEndTime] = useState(event.endTime || startTime);
    
    const handleStartChange = (start) => {
        setStartTime(start)
    }
    
    const handleEndChange = (end) => {
        setEndTime(end)
    }
    
    const handleChange = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value
        
        setInputs({ ...inputs, [name]: value })
    }
    
    const handleSubmit = async (ev) => {
        ev.preventDefault();
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
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ m: 3 }} >
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
                            name="location"
                            required
                            fullWidth
                            id="location"
                            label="Location"
                            value={inputs.location}
                            onChange={handleChange}
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
                        type="submit"
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

// await dispatch(getTrips())
// const addNew = !!!event;

// const { name, location, description } = inputs;

// useEffect(() => {
    //     if (!addNew){
        //         setInputs({
            //             name: event.name,
            //             location: event.location,
            //             description: event.description,
            //         });
            //         setStartTime(event.startTime);
            //         setEndTime(event.endTime);
            //     }
            //     return () => {
                //         setInputs({
                    //             name: '',
                    //             location: '',
                    //             description: ''
                    //         });
                    //         setStartTime(new Date());
                    //         setEndTime(new Date());
                    //     }
                    // }, [])

// !addNew ? await dispatch(editEvent({ ...event, name: name, location, description, trip, startTime, endTime })) : await dispatch(addEvent({ name: name, location, description, trip, startTime, endTime }));
// setInputs({ name: '', location: '', description: ''});
// setStartTime(new Date());
// setEndTime(new Date());