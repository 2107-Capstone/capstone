import React, { useEffect, useState } from 'react'

import { addEvent } from '../../store/events'
import { useDispatch } from 'react-redux'
// import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Grid, Button, TextField } from '@mui/material'

const AddEvent = ({trip, handleClose}) => {      
//ADD EVENT
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({
        eventName: '',
        location: '',
        description: '',
        startTime: new Date(),
        endTime: new Date()
        
    })
    const { eventName, location, description  } = inputs;
    
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(startTime);
    
    const handleStartChange = (newVal) => {
        setStartTime(newVal)
    }
    
    const handleEndChange = (newVal) => {
        setEndTime(newVal)
    }
    
    const handleChange = (ev) => {
        const change = {};
        change[ev.target.name] = ev.target.value;
        setInputs({eventName, location, description, ...change })
    }
    
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            await dispatch(addEvent({name: eventName, location, description, trip, startTime, endTime }));
            setInputs({ eventName: '', location: '', description: ''});
            setStartTime(new Date());
            setEndTime(new Date());
            handleClose();
        }
        catch(err){
            console.log(err)
        }
    }
//

    if (!trip) return '...loading'
    
    return (
        <>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ m: 3 }} >
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="eventName"
                            required
                            fullWidth
                            id="eventName"
                            label="Event Name"
                            value={eventName}
                            autoFocus
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
                            value={location}
                            autoFocus
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            fullWidth
                            id="description"
                            label="Description"
                            value={description}
                            autoFocus
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
                        Add Event
                    </Button>
                </Grid>
            </Box>
        </>
    )
}
export default AddEvent;