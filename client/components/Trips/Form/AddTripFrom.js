import React, { useEffect, useState } from "react"

import { DateTimePicker, LocalizationProvider } from "@mui/lab"
import { Container, Box, TextField, Typography, Grid, Button } from "@mui/material"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { addTrip } from "../../../store/trips"
import { useDispatch } from "react-redux"

/////// import image //////////////////
const airplane = '/images/airplane.png'

const googleKey = process.env.MAP_API;

const AddTripFrom = () => {
    const dispatch = useDispatch()

    const [input, setinput] = useState({
        name: '',
        description: '',
        startTime: new Date(),
        endTime: new Date(),
        // lat: '',
        // lng: ''
    })

    const [location, setlocation] = useState('')
    const [imageUrl, setimageUrl] = useState('')

    let googlePlace;
    useEffect(() => {
        const autocomplete = new google.maps.places.Autocomplete(googlePlace, { key: googleKey })
        autocomplete.addListener("place_changed", (evt) => {

            const place = autocomplete.getPlace()
            if (place.formatted_address) {
                setlocation(place.formatted_address)
            }
            else {
                setlocation(place.name)
            }

            if (place.photos) {
                const photo = place.photos[0].getUrl()
                setimageUrl(photo)
            }
            else {
                setimageUrl(airplane)
            }
        })
    }, [])

    const [error, seterror] = useState({
        endTimeErr: '',
        startTimeErr: ''
    })

    const handleStartChange = (startTime) => {
        if (new Date() > startTime) {
            setinput({ ...input, startTime: '' })
            seterror({ ...error, startTimeErr: 'Time must be in future.' })
            return
        }
        seterror({ ...error, startTimeErr: '' })
        setinput({ ...input, startTime })
    }

    const handleEndChange = (endTime) => {
        if (input.startTime > endTime) {
            setinput({ ...input, endTime: '' })
            seterror({ ...error, endTimeErr: 'End Time must be a date ahead of Start Time.' })
            return
        }
        seterror({ ...error, endTimeErr: '' })
        setinput({ ...input, endTime })
    }

    const handleChange = (evt) => {
        const name = evt.target.name
        const value = evt.target.value

        setinput({ ...input, [name]: value })
    }

    const handleSubmit = async () => {
        try {

            const newTrip = { ...input, imageUrl, location }
            dispatch(addTrip(newTrip))
            setinput({
                name: '',
                description: '',
                startTime: new Date(),
                endTime: new Date(),
                // lat: '',
                // lng: ''
            })
            setimageUrl('')
            setlocation('')
            googlePlace.value = ''
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <Container>
            <Box>
                <Typography variant='h5' align='center'>
                    Add New Trip
                </Typography>
                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Trip Name"
                                value={input.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="description"
                                label="Trip Details"
                                name="description"
                                value={input.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="location"
                                label="Destination"
                                name="location"
                                inputRef={ref => googlePlace = ref}
                            />
                        </Grid>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Grid item xs={12} sm={6}>
                                <DateTimePicker
                                    label="Start Time"
                                    name='startTime'
                                    value={input.startTime}
                                    onChange={handleStartChange}
                                    renderInput={(params) => <TextField helperText={error.startTimeErr} fullWidth {...params} />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DateTimePicker
                                    label="End Time"
                                    name='endTime'
                                    value={input.endTime}
                                    onChange={handleEndChange}
                                    renderInput={(params) => <TextField fullWidth helperText={error.endTimeErr} {...params} />}
                                />
                            </Grid>
                        </LocalizationProvider>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add New Trip
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default AddTripFrom
