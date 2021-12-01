import React, { useEffect, useState, useRef, useCallback } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { parseISO, format } from 'date-fns';

import CircularLoading from '../Loading/CircularLoading'

import { Box, Grid, Button, Tooltip, Divider } from '@mui/material'

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

import FaMapMarkerAlt from 'react-icons/fa'
import { getTrips } from '../../store';

import mapStyles from './mapStyles';


// const mapStyles = {
//     width: '60%',
//     height: '60%',
// }
const mapContainerStyle = {
    height: "50vh",
    width: "50vw",
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};

const tripZoom = 12;

export default function AllTripsMap() {
    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: process.env.MAP_API
    // });
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth);

    let trips = useSelector(state => state.trips);

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
            trip.trip.events.map(event => {
                setMarkers(prevMarkers => [...prevMarkers,
                {
                    time: format(parseISO(event.startTime), 'Pp'),
                    key: event.id + Math.random().toString(16),
                    id: event.id,
                    lat: +event.lat,
                    lng: +event.lng,
                    name: `${event.name} - ${event.location}`,
                    trip: trip.trip.name,
                    location: event.location,
                    // url: idx > 9 ? `http://labs.google.com/ridefinder/images/mm_20_${urls[idx % 9]}.png` : `http://labs.google.com/ridefinder/images/mm_20_${urls[idx]}.png` 
                    url: idx > 10 ? `/pin-${idx % 10}.svg` : `/pin-${idx}.svg`
                }]);
                trip.color = idx > 10 ? colors[idx % 10] : colors[idx]
            })
        });
    }, [update])

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
        // ev.stopPropagation()
        setSelected(marker);
    }

    const [selectedTrip, setSelectedTrip] = useState({ id: 0, lat: 34.456748, lng: -75.462405 });

    // if (loadError) return "Error";
    // if (!isLoaded || !trips) return <CircularLoading />
    if (!trips) return <CircularLoading />
    return (
        <div>
            <Tooltip title='Refresh Event Markers'>
                <Button startIcon={<RefreshIcon />} variant='contained' color='info' onClick={() => setUpdate(prevUpdate => prevUpdate + Math.random())} />
            </Tooltip>
            <div style={{ display: 'flex' }}>
                <div>
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
                </div>
                <div>
                    {
                        trips.map(trip => (
                            <Accordion sx={{ minWidth: '100%' }} key={trip.id + Math.random().toFixed(2)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: trip.color }} />}
                                    id="trip-header"
                                    onClick={() => setSelectedTrip(trip.trip)}
                                    sx={{ borderRight: `4px solid ${trip.color}` }}
                                >
                                    <Typography>
                                        {trip.trip.name}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ maxHeight: 500, overflow: 'auto' }}>
                                    {
                                        trip.trip.events.map(event => (
                                            <Card className='card' key={event.id + Math.random().toFixed(2)} sx={{ minWidth: '100%', mb: 1, mt: 1, }}

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
                        ))
                    }
                </div>
            </div>
        </div>
    );
}