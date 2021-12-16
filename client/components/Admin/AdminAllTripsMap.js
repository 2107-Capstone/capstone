import React, { useEffect, useState, useRef, useCallback } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom';

import CircularLoading from '../Loading/CircularLoading'

import { Box, Container, FormGroup, FormControlLabel, Switch, Grid, Button, Tooltip, Divider } from '@mui/material'

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import FaMapMarkerAlt from 'react-icons/fa'
import { getTrips } from '../../store';

import mapStyles from './mapStyles';

const mapContainerStyle = {
    height: "50vh",
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};

const tripZoom = 12;

export default function AdminAllTripsMap() {
    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: process.env.MAP_API
    // });
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth);

    ///////////  Trip View Selection //////////
    // const [showTrips, setshowTrips] = useState('all');
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked)
    };
    // const { trips } = useSelector(state => state)
    const trips = checked ? useSelector(state => state.adminTrips.filter(adminTrip => !adminTrip.isOpen)) : useSelector(state => state.adminTrips.filter(adminTrip => adminTrip.isOpen))

    // let trips = useSelector(state => state.trips);

    const [markers, setMarkers] = useState([]);
    const [trackingMarkers, setTrackingMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [update, setUpdate] = useState(0);


    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(tripZoom);
    }, []);

    useEffect(() => {
        // dispatch(getTrips());
        setMarkers(prevMarkers => []);
        trips.forEach((trip, idx) => {
            trip.events.map(event => {
                setMarkers(prevMarkers => [...prevMarkers,
                {
                    time: format(parseISO(event.startTime), 'Pp'),
                    key: event.id,
                    id: event.id,
                    lat: +event.lat,
                    lng: +event.lng,
                    name: `${event.name} - ${event.location}`,
                    trip: trip.name,
                    location: event.location,
                    // url: idx > 9 ? `http://labs.google.com/ridefinder/images/mm_20_${urls[idx % 9]}.png` : `http://labs.google.com/ridefinder/images/mm_20_${urls[idx]}.png` 
                    url: idx > 10 ? `/pin-${idx % 10}.svg` : `/pin-${idx}.svg`
                }]);
                trip.color = idx > 10 ? colors[idx % 10] : colors[idx]
            })
        });
    }, [update, checked])

    //TODO: Add form to add new event after clicking on map and getting lat/lng

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
        // ev.stopPropagation()
        setSelected(marker);
    }
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = panel => (evt, isExpanded) => {

        setExpanded(isExpanded ? panel : false)
    }
    const [selectedTrip, setSelectedTrip] = useState({ id: 0, lat: 34.456748, lng: -75.462405 });

    // if (loadError) return "Error";
    // if (!isLoaded || !trips) return <CircularLoading />
    if (!trips) return <CircularLoading />
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 1 }}>
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
                <Grid item xs={12} >
                    <Box sx={{maxHeight: 300, overflow: 'auto'}}>
                        
                    {
                        trips.map(trip => (
                            <Box display='flex' flexWrap='wrap' key={trip.id}>
                                <Accordion sx={{ margin: 1, minWidth: '100%'}} 
                                    expanded={expanded === trip.id}
                                    onChange={handleAccordionChange(trip.id)}
                                    disableGutters={true}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: trip.color }} />}
                                        id="trip-header"
                                        onClick={() => {
                                            if (selectedTrip.id === trip.trip.id) {
                                                setSelectedTrip({ id: 0 })
                                            } else {
                                                setSelectedTrip(trip)
                                            }
                                        }}
                                        sx={{ borderRight: `4px solid ${trip.color}` }}
                                    >
                                        <Button
                                            component={Link}
                                            to={`/admin/admintrips/${trip.id}`}
                                            variant='contained'
                                            color='secondary'
                                        >

                                            {trip.name}
                                        </Button>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto' }}>
                                        {
                                            trip.events.map(event => (
                                                <Card className='card' key={event.id} sx={{ minWidth: '100%', mb: 1, mt: 1}}

                                                >
                                                    <CardContent sx={{ mb: 0 }} onClick={() => handleClick(event.id)}>
                                                        <Box display='flex' flexDirection='column' >
                                                            <Typography  color='text.primary' variant="subtitle1">
                                                                {event.name}
                                                            </Typography>
                                                            <Typography variant='subtitle2' color='text.primary' >
                                                                {event.description}
                                                            </Typography>

                                                            <Typography variant='subtitle2' color='text.secondary' >
                                                                {event.location}
                                                            </Typography>
                                                            <Divider color='grey' fullWidth/>
                                                            <Typography color='text.secondary' variant="caption" >
                                                                {format(parseISO(event.startTime), 'Pp')}
                                                            </Typography>
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
                            zoom={selectedTrip.id === 0 ? 2 : tripZoom}
                            // zoom={tripId ? 8 : 3}
                            mapContainerStyle={mapContainerStyle}
                            style={mapStyles}
                            center={{ lat: +selectedTrip.lat, lng: +selectedTrip.lng }}
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
                                            <Typography variant={'subtitle1'}>
                                                {selected.trip}
                                            </Typography>
                                            <Divider />
                                            <Typography variant={'subtitle2'}>
                                                {selected.name}
                                            </Typography>
                                            <Typography variant={'caption'}>
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