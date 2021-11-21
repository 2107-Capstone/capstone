import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addExpense } from '../../store';

////////////////// MATERIAL UI /////////////////
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Grid, Button, TextField, FormControl, InputLabel, Select, Menu, MenuItem } from '@mui/material'

const AddExpense = ({trip, handleClose}) => {      
    const dispatch = useDispatch()
    const categories = useSelector(state => state.categories)
    
    const [inputs, setInputs] = useState({
        description: '',
        amount: '',
        categoryId: '',
        paidById: ''
    })
    const { description, amount, categoryId, paidById  } = inputs;
    
    const [datePaid, setDatePaid] = useState(new Date());
    
    const handleDateChange = (newVal) => {
        setDatePaid(newVal)
    }
    
    const handleChange = (ev) => {
        const change = {};
        change[ev.target.name] = ev.target.value;
        setInputs({description, amount, categoryId, paidById, ...change })
    }
    
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            await dispatch(addExpense({name: description, amount, datePaid, paidById, categoryId, tripId: trip.tripId }));
            setInputs({ description: '', amount: '', paidById: '', categoryId: ''});
            setDatePaid(new Date());
            handleClose();
        }
        catch(err){
            console.log(err)
        }
    }

    if (!trip) return '...loading'
    
    return (
        <>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ m: 3 }} >
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="description"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            value={description}
                            autoFocus
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="amount"
                            required
                            fullWidth
                            id="amount"
                            label="Amount"
                            value={amount}
                            autoFocus
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="paidById-label">Paid By</InputLabel>
                            <Select
                                id="paidById"
                                value={paidById}
                                label="Paid By"
                                name='paidById'
                                onChange={handleChange}
                            >
                                {
                                    trip.trip.userTrips.map(user => (
                                        <MenuItem key={user.userId + Math.random().toString(16)} value={user.userId}>{user.user.username}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="categoryId-label">Category</InputLabel>
                            <Select
                                id="categoryId"
                                value={categoryId}
                                label="Category"
                                name='categoryId'
                                onChange={handleChange}
                            >
                                {
                                    categories.map(category => (
                                        <MenuItem key={category.id + Math.random().toString(16)} value={category.id}>{category.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={12} sm={6} sx={{mt: 2, mb: 2}}>
                            <DatePicker
                                label="Date Paid"
                                name='datePaid'
                                value={datePaid}
                                onChange={handleDateChange}
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
                        Add Expense
                    </Button>
                </Grid>
            </Box>
        </>
    )
}
export default AddExpense;