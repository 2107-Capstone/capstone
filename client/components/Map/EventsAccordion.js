import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'

import { parseISO, format, isAfter } from 'date-fns';


////////////////// COMPONENTS /////////////////

import CircularLoading from '../Loading/CircularLoading'
import EventForm from './EventForm'
import EventsCard from './EventsCard';
////////////////// MATERIAL UI /////////////////
import { Accordion, AccordionActions, Alert, Box, Button, IconButton, Typography, Dialog, Snackbar } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

////////////////// MATERIAL ICONS /////////////////
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MyLocationIcon from '@mui/icons-material/MyLocation';

export default function EventsAccordion ({ events, handleFindMarker,  tripOpen, trip,}) {
    
    const [eventToEdit, setEventToEdit] = useState({});
    const [open, setOpen] = useState(false)
    
    const handleClose = () => {
        setOpen(false);
        setEventToEdit({})
    }

    if (!events) {
        return <CircularLoading />
    }

    return (
        <Box display='flex' flexDirection='column'>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <EventForm
                    trip={trip}
                    event={eventToEdit}
                    handleClose={handleClose}
                />
            </Dialog>
            <Accordion sx={{ margin: 1, minWidth: '100%'}} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    Events
                </AccordionSummary>
                <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto' }}>
                {
                    events.map(event => (
                        <EventsCard key={event.id} handleFindMarker={handleFindMarker} setEventToEdit={setEventToEdit} setOpen={setOpen} tripOpen={tripOpen} event={event} />
                    ))
                }
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
