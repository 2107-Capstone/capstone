import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { parseISO, format } from 'date-fns';

import CircularLoading from '../Loading/CircularLoading'
import { findZoom, findCenter } from './mapFunctions'

import { Box, FormGroup, FormControlLabel, Switch, Grid, Button, Tooltip, Divider } from '@mui/material'

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

import mapStyles from './mapStyles';


export default function AllTripsMap() {
    
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
                setMarkers(prevMarkers => [...prevMarkers,
                {
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
                trip.color = idx > 10 ? colors[idx % 10] : colors[idx]
            })
        });
        
        if (selectedTrip.id !== 0){
            if (selectedTrip.events.length === 0) {
                setZoom(() => 8)
                setCenter(() => ({lat: +selectedTrip.lat, lng: +selectedTrip.lng}))
            } else {
                setCenter(() => findCenter(selectedTrip.events))
                setZoom(() => findZoom(selectedTrip.events))
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
        console.log('markers', markers)
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
    if (!trips) return <CircularLoading />

    const lat = +center.lat;
    const lng = +center.lng;
    
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
                    {/* <Box style={{margin: 1}}> */}
                    {
                        trips.map(trip => (
                            <Box display='flex' flexWrap='wrap' key={trip.id}>
                                <Accordion sx={{ margin: 1, minWidth: '100%' }} 
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
                                                setSelectedTrip(trip.trip)
                                            }
                                        }}
                                        sx={{ borderRight: `4px solid ${trip.color}` }}
                                    >
                                        <Typography>
                                            {trip.trip.name}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ maxHeight: 500, overflow: 'auto' }}>
                                        {
                                            trip.trip.events.map(event => (
                                                <Card className='card' key={event.id} sx={{ minWidth: '100%', mb: 1, mt: 1, }}

                                                >
                                                    <CardContent sx={{ mb: 0 }} onClick={() => handleClick(event.id)}>
                                                        <Typography gutterBottom>
                                                            {event.name} - {event.location}
                                                        </Typography>
                                                        <Typography color="text.secondary" variant="subtitle2">
                                                            {format(parseISO(event.startTime), 'Pp')}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        ))
                    }
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