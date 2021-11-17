import React, { useEffect, useState } from 'react'

import { addEvent } from '../../store/events'
import { useDispatch } from 'react-redux'
// import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from '@mui/material'

const AddEvent = ({trip}) => {      
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
            setInputs({ eventName: '', location: '', description: '', trip: ''});
            setStartTime(new Date());
            setEndTime(new Date());
        }
        catch(err){
            console.log(err)
        }
    }
//

    if (!trip) return '...loading'
    
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                Event Name:
                <input type="text" name='eventName' value={eventName} onChange={handleChange} />
                </label>
                <label>
                Location:
                <input type="text" name='location' value={location} onChange={handleChange} />
                </label>
                <label>
                Description:
                <input type="text" name='description' value={description} onChange={handleChange} />
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Start Time"
                        name='startTime'
                        value={startTime}
                        onChange={handleStartChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DateTimePicker
                        label="End Time"
                        name='endTime'
                        value={endTime}
                        onChange={handleEndChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <input type="submit" value="Submit" />
            </form>
        </>
    )
}
export default AddEvent;