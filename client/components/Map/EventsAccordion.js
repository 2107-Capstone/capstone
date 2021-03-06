import React, { useState } from 'react'

import { parseISO, format, isAfter } from 'date-fns';


////////////////// COMPONENTS /////////////////
import CircularLoading from '../Loading/CircularLoading'
import EventForm from './EventForm'
import EventCard from './EventCard';

////////////////// MATERIAL UI /////////////////
import { Accordion, AccordionSummary, AccordionDetails, Box, Dialog } from '@mui/material'

////////////////// MATERIAL ICONS /////////////////
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function EventsAccordion({ events, handleFindMarker, tripOpen, trip, setSelected, deleteEvent, dispatch }) {

    const [eventToEdit, setEventToEdit] = useState({});
    const [open, setOpen] = useState(false)

    const handleCloseForm = () => {
        setOpen(false);
    }
    const handleClickYes = async (id) => {
        try {
            await dispatch(deleteEvent(id))
        } catch (err) {
            console.log(err)
        }
    }

    if (!events) {
        return <CircularLoading />
    }

    return (
        <Box display='flex' flexDirection='column'
            sx={{ maxHeight: 300, overflow: 'auto' }}
        >
            <Dialog
                open={open}
                onClose={handleCloseForm}
            >
                <EventForm
                    trip={trip}
                    event={eventToEdit}
                    handleClose={handleCloseForm}
                />
            </Dialog>
            <Accordion sx={{ margin: 1, minWidth: '100%' }} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    EVENTS ({events.length})
                </AccordionSummary>
                <AccordionDetails >
                    {
                        events.map(event => (
                            <EventCard key={event.id} handleFindMarker={handleFindMarker} setEventToEdit={setEventToEdit} setOpen={setOpen} tripOpen={tripOpen} event={event} setSelected={setSelected} handleClickYes={handleClickYes} />
                        ))
                    }
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}