import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { parseISO, format, isAfter } from 'date-fns';

import { updateUser, deleteEvent, getTrips } from '../../store';
////////////////// COMPONENTS /////////////////

import CircularLoading from '../Loading/CircularLoading'

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

export default function EventsCard ({ event, handleFindMarker, setEventToEdit, setOpen, tripOpen }) {
    
    const dispatch = useDispatch();
    
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const handleClose = () => {
        setOpen(false);
        setOpenSnackbar(false)
    }
    if (!event) {
        return <CircularLoading />
    }

    return (
        <Card className='card' key={event.id} sx={{ minWidth: '100%', mb: 1, mt: 1, pb: 0}}
        >
            <CardContent sx={{ minWidth: '100%', mb: 0 , paddingBottom: 0}} onClick={handleFindMarker(event.id)}>
                    <Box display='flex' flexDirection='column' >
                        <Typography gutterBottom color='text.primary' variant="subtitle1">
                            {event.name}
                        </Typography>
                        <Typography gutterBottom color='text.primary' variant="subtitle1">
                            {event.location}
                        </Typography>
                        <Typography variant='subtitle2' color='text.primary'>
                            {event.description}
                        </Typography>
                        <Divider fullWidth/>
                        <Typography color='text.secondary' variant="caption" >
                            {format(parseISO(event.startTime), 'Pp')}
                        </Typography>
                    </Box>
            </CardContent>
            {
                tripOpen ? 
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
                                                await dispatch(deleteEvent(event.id))
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
                            onClick={() => setOpenSnackbar(true)}
                        >
                            Delete
                        </Button>
                    </Box>
                : ''
            }
        </Card>
                      
    );
}
