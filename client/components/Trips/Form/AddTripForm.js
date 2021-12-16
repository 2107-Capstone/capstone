import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

/////////////// REDUX /////////////////////
import { addTrip, editTrip } from "../../../store/trips"

///////////// MATERIAL UI /////////////////////////
import { DateTimePicker, LocalizationProvider } from "@mui/lab"
import { Container, Box, TextField, Typography, Grid, Button } from "@mui/material"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import CardTravelIcon from '@mui/icons-material/CardTravel';
import CloseIcon from "@mui/icons-material/Close";

/////// IMPORT LOGO IMAGE //////////////////
const airplane = '/images/airplane.png'

const AddTripForm = ({trip, handleClose}) => {
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [input, setinput] = useState({
        userTripId: trip?.id || '',
        id: trip?.trip.id || '',
        name: trip?.trip.name || '',
        description: trip?.trip.description || '',
        imageUrl: airplane,
        location: trip?.trip.location || '',
        startTime: trip?.trip.startTime || new Date(),
        endTime: trip?.trip.endTime || new Date(),
        lat: trip?.trip.lat || 40.7127753,
        lng: trip?.trip.lng || -74.0059728,
        // userId: auth.id,
    })
        
    let googlePlace;
    useEffect(() => {
        const autocomplete = new google.maps.places.Autocomplete(googlePlace)
        googlePlace.value = input.location

        autocomplete.addListener("place_changed", function (evt) {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
                setinput(input => ({ ...input, location: place.formatted_address }))
            }
            else {
                setinput(input => ({ ...input, location: place.name }))
            }

            if (place.photos) {
                const photo = place.photos[0].getUrl()
                setinput(input => ({ ...input, imageUrl: photo }))
            }

            if (place.geometry.location) {
                setinput(input => ({ ...input, lat: place.geometry.location.lat() }))
                setinput(input => ({ ...input, lng: place.geometry.location.lng() }))
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
            if (trip?.id){
                dispatch(editTrip({...input}))
            } else {
                dispatch(addTrip({...input}))
            }
            setinput({
                userTripId: '',
                id: '',
                name: '',
                imageUrl: '',
                location: '',
                description: '',
                startTime: new Date(),
                endTime: new Date(),
                lat: 40.7127753,
                lng: -74.0059728
            })
            googlePlace.value = ''
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
        {
            trip?.id ? <CloseIcon onClick={handleClose}/> : ''
        }
        <Container>
            <Box>
                <Typography sx={{mt: 1}} align='center' variant='h5' gutterBottom>
                    <CardTravelIcon />&nbsp;{trip?.id ? 'Edit Trip' : 'Add New Trip'}
                </Typography>
                {/* <Typography variant='h5' align='center'>
                    Add New Trip
                </Typography> */}
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
                                // required
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
                                    minDate={new Date()}
                                    minutesStep={15}
                                    renderInput={(params) => <TextField helperText={error.startTimeErr} fullWidth {...params} />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DateTimePicker
                                    label="End Time"
                                    name='endTime'
                                    value={input.endTime}
                                    onChange={handleEndChange}
                                    minDate={new Date(input.startTime)}
                                    minutesStep={15}
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
                        {trip?.id ? 'Edit Trip' : 'Add New Trip'}
                    </Button>
                </Box>
            </Box>
        </Container>
        </>
    )
}

export default AddTripForm