import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { parseISO, format, isAfter } from 'date-fns';

import CircularLoading from '../Loading/CircularLoading'
import { findZoom, findCenter } from './mapFunctions'
import EventForm from './EventForm';
import { Box, FormGroup, FormControlLabel, Dialog, Switch, IconButton, Grid, Button, Tooltip, Divider, Snackbar, } from '@mui/material'
import { deleteEvent, getTrips } from '../../store';
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CloseIcon from '@mui/icons-material/Close';

import mapStyles from './mapStyles';
import theme from '../../theme';

export default function AllTripsMap() {
    const dispatch = useDispatch();
    
    ///////////  Trip View Selection //////////
    const [checked, setChecked] = useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked)
        setSelectedTrip({id: 0})
    };
    const trips = checked ? useSelector(state => state.trips.filter(trip => !trip.trip.isOpen)) : useSelector(state => state.trips.filter(trip => trip.trip.isOpen))
    
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [update, setUpdate] = useState(0);
    
    const mapContainerStyle = {
        height: "50vh",
    };
    
    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
    };
    
    const tripZoom = 12;

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(tripZoom);
    }, []);
    
    const defaultCoords = {
        lat: 34.456748,
        lng: -75.462405
    }

    const [selectedTrip, setSelectedTrip] = useState({id: 0});
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState({defaultCoords});

    

    useEffect(() => {
        setMarkers(() => []);
        trips.forEach((trip, idx) => {
            trip.trip.events.map(event => {
                trip.color = idx > 10 ? colors[idx % 10] : colors[idx]
                event.color = trip.color
                setMarkers(prevMarkers => [...prevMarkers,
                {
                    color: trip.color,
                    time: format(parseISO(event.startTime), 'Pp'),
                    key: event.id,
                    id: event.id,
                    lat: +event.lat,
                    lng: +event.lng,
                    name: event.name,
                    trip: trip.trip.name,
                    location: event.location,
                    url: idx > 10 ? `/pin-${idx % 10}.svg` : `/pin-${idx}.svg`
                }]);
            })
        });
        
        if (selectedTrip.id !== 0){
            if (selectedTrip.trip.events.length === 0) {
                setZoom(() => 8)
                setCenter(() => ({lat: +selectedTrip.trip.lat, lng: +selectedTrip.trip.lng}))
            } else {
                setCenter(() => findCenter(selectedTrip.trip.events))
                setZoom(() => findZoom(selectedTrip.trip.events))
            }
        } else if (selectedTrip.id === 0){
            if (markers.length === 0){
                setZoom(() => 3)
                setCenter(() => ({lat: defaultCoords.lat, lng: defaultCoords.lng}))
            } else {
                setCenter(() => findCenter(markers))
                setZoom(() => findZoom(markers))
            }
        }
      
    }, [update, checked, selectedTrip.id, markers.length])

    const colors = {
        0: '#F70909',
        1: `#3470E7`,
        2: '#F78E09',
        3: `#077D2C`,
        4: `#6C3AFC`,
        5: `#EC5B02`,
        6: `#0DEDFF`,
        7: `#04B93D`,
        8: `#C4BB00`,
        9: `#363B3D`,
        10: `#180195`,
    }

    const displayMarkers = () => {
        // console.log('markers', markers)
        return markers.map((marker) => {
            return (
                <Marker
                    key={marker.key}
                    id={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    name={marker.name}
                    icon={{ url: marker.url }}
                    onClick={() => { setSelected(marker) }}
                />
            )
        })
    }

    const handleClick = (id) => {
        setUpdate(prevUpdate => prevUpdate + Math.random())
        const marker = markers.find(marker => marker.id === id);
        setSelected(marker);
    }

    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = panel => (evt, isExpanded) => {
        
        setExpanded(isExpanded ? panel : false)
    }

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [open, setOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState({});

    const handleClose = () => {
        setOpen(false);
        setEventToEdit({})
        setOpenSnackbar(false)
    }

    if (!trips) return <CircularLoading />

    const lat = +center.lat;
    const lng = +center.lng;
    console.log(eventToEdit)
    console.log(selectedTrip)
    console.log('selected, ', selected)
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <EventForm
                        trip={selectedTrip}
                        event={eventToEdit}
                        handleClose={handleClose}
                    />
                </Dialog>
                <Box>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch
                                checked={checked}
                                onChange={handleChange}
                            />}
                            label='Closed Trips'
                        />
                    </FormGroup>
                </Box>
                <Box sx={{ display: 'flex', alignSelf: 'center' }}>
                    <CardTravelIcon fontSize='medium' />
                    {
                        checked ?
                            <Typography variant='h5'>
                                &nbsp;CLOSED TRIPS
                            </Typography>
                            :
                            <>
                                <Typography variant='h5'>
                                    &nbsp;ACTIVE TRIPS
                                </Typography>
                            </>
                    }
                </Box>
                <Button startIcon={<RefreshIcon />} size='large' onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())} >
                    Refresh Event Markers
                </Button>
            </Box>
            <Grid container columnSpacing={2} rowSpacing={2} >
                <Grid item xs={12} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Box >
                    {
                        trips.map(trip => (
                            <Box display='flex' flexWrap='wrap' key={trip.id}>
                                <Accordion sx={{ margin: 1, minWidth: '100%'}} 
                                    expanded={expanded === trip.id}
                                    onChange={handleAccordionChange(trip.id)}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: trip.color }} />}
                                        id="trip-header"
                                        onClick={() => {
                                            if (selectedTrip.id === trip.trip.id){
                                                setSelectedTrip({id: 0})
                                            } else {
                                                setSelectedTrip(trip)
                                            }
                                        }}
                                        sx={{ borderRight: `4px solid ${trip.color}` }}
                                    >
                                        <Button 
                                            component={Link}
                                            to={`/trips/${trip.tripId}`}
                                            variant='contained'
                                            color='secondary'
                                        >
                                        
                                            {trip.trip.name}
                                        </Button>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto' }}>
                                        {
                                            trip.trip.events.sort((a,b) => isAfter(new Date(a.startTime),new Date(b.startTime)) ? 1 : -1).map(event => (
                                                <Card className='card' key={event.id} sx={{ minWidth: '100%', mb: 1, mt: 1, pb: 0}}

                                                >
                                                    <CardContent sx={{ mb: 0 , paddingBottom: 0}} onClick={() => handleClick(event.id)}>
                                                        <Box 
                                                            display='flex'
                                                            justifyContent='space-between'
                                                            sx={{backgroundColor: 'inherit'}}
                                                        >
                                                            <Box display='flex' flexDirection='column'>
                                                                <Typography gutterBottom color='text.primary' variant="subtitle1">
                                                                    {event.name} - {event.location}
                                                                </Typography>
                                                                <Typography color='text.secondary' variant="caption" >
                                                                    {format(parseISO(event.startTime), 'Pp')}
                                                                </Typography>
                                                                <Divider color={event.color}/>
                                                                <Typography variant='subtitle2' color='text.primary'  sx={{mt: 1, fontStyle: 'italic'}}>
                                                                    {event.description}
                                                                </Typography>
                                                                
                                                            </Box>
                                                            {/* {
                                                            trip.trip.isOpen ? 
                                                                <Box
                                                                    display='flex'
                                                                    justifyContent='space-evenly'
                                                                >
                                                                    <Button
                                                                        startIcon={<ModeEditIcon />} color='info'
                                                                        size='small'
                                                                        onClick={() => {
                                                                            setEventToEdit(event);
                                                                            setOpen(true);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Snackbar
                                                                        sx={{ mt: 9 }}
                                                                        open={openSnackbar}
                                                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                                        autoHideDuration={6000}
                                                                        onClose={handleClose}
                                                                        message={'Are you sure you want to delete this event?'}
                                                                        action={
                                                                            <>
                                                                                <Button color="secondary" size="small" 
                                                                                    onClick={async () => {
                                                                                        try {
                                                                                            await dispatch(deleteEvent(eventToEdit.id))
                                                                                            await dispatch(getTrips())
                                                                                            // handleAccordionChange(selectedTrip.id)
                                                                                            setExpanded(false)
                                                                                            setSelectedTrip({id: 0})
                                                                                            setUpdate(prevUpdate => prevUpdate + Math.random())
                                                                                        } catch (err) {
                                                                                            console.log(err)
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    YES
                                                                                </Button>
                                                                                <Button color="secondary" size="small" onClick={handleClose}>
                                                                                    NO
                                                                                </Button>
                                                                                <IconButton
                                                                                    size="small"
                                                                                    aria-label="close"
                                                                                    color="inherit"
                                                                                    onClick={handleClose}
                                                                                >
                                                                                    <CloseIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </>
                                                                        }
                                                                    />
                                                                    <Button
                                                                        startIcon={<DeleteForeverIcon />} color='error'
                                                                        size='small'
                                                                        onClick={() => {
                                                                            console.log(event)
                                                                            setEventToEdit(event)

                                                                            setOpenSnackbar(true)
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Box>
                                                            : ''
                                                            } */}


                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        ))
                    }
                    </Box>
                </Grid>
                {/* <Box style={{ margin: 1}}> */}
                <Grid item xs={12} >
                    <Box style={{ marginRight: 2 }}>
                        <GoogleMap
                            id='map'
                            options={options}
                            onLoad={onMapLoad}
                            // zoom={selectedTrip.id === 0 ? findZoom(markers) : tripZoom}
                            zoom={zoom}
                            // zoom={tripId ? 8 : 3}
                            mapContainerStyle={mapContainerStyle}
                            style={mapStyles}
                            // center={{ lat: +selectedTrip.lat, lng: +selectedTrip.lng}}
                            center={{ lat, lng }}
                        >
                            {displayMarkers()}
                            {
                                selected ? (
                                    <InfoWindow
                                        open={open}
                                        position={{ lat: +selected.lat, lng: +selected.lng }}
                                        onCloseClick={() => {
                                            setSelected(null);
                                        }}
                                    >
                                        <div style={{ margin: '0 1rem .5rem 1rem' }}>
                                            <Typography gutterBottom variant={'subtitle1'} color={'text.dark.primary'}>
                                                {selected.trip}
                                            </Typography>
                                            <Divider color={selected.color}/>
                                            <Typography variant={'subtitle2'} color={'text.dark.primary'}>
                                                {selected.name}
                                            </Typography>
                                            <Typography variant={'caption'} color={'text.dark.secondary'}>
                                                {selected.time}
                                            </Typography>
                                        </div>
                                    </InfoWindow>)
                                    : null
                            }
                        </GoogleMap>
                    </Box>
                </Grid>
            </Grid>
        </>

    );
}