import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { parseISO, format, isAfter } from 'date-fns';

/////////////// REDUX ///////////////////////
import { updateUser, deleteEvent, getTrips } from '../../store';

////////////////// COMPONENTS /////////////////
import SnackbarForDelete from '../MuiComponents/SnackbarForDelete';
import CircularLoading from '../Loading/CircularLoading'

////////////////// MATERIAL UI /////////////////
import { Card, CardContent, Divider, Box, Button, Typography } from '@mui/material'

////////////////// MATERIAL ICONS /////////////////
import { DeleteForever as DeleteForeverIcon, ModeEdit as ModeEditIcon } from '@mui/icons-material';

export default function EventsCard({ event, handleFindMarker, setOpen, tripOpen, setSelected, handleClickYes, setEventToEdit }) {

    const dispatch = useDispatch();

    const [openSnackbar, setOpenSnackbar] = useState(false)

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    if (!event) {
        return <CircularLoading />
    }

    return (
        <Card className='card' key={event.id} sx={{ minWidth: '100%', mb: 1, mt: 1, pb: 0 }}
        >
            <CardContent sx={{ minWidth: '100%', mb: 0, paddingBottom: 0 }} onClick={() => handleFindMarker(event.id, setSelected)}>
                {/* <Box display='flex' justifyContent='space-between'> */}
                <Box display='flex' flexDirection='column' sx={{ mb: 0 }}>
                    <Typography color='text.primary' variant="subtitle1">
                        {event.name}
                    </Typography>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography color='text.primary' variant="subtitle2">
                            {event.description}
                        </Typography>
                        {
                            tripOpen &&
                            <Box
                                display='flex'
                                justifyContent='space-between'
                            >
                                <Box sx={{ mr: 2 }}>
                                    <Button
                                        startIcon={<ModeEditIcon />} color='info'
                                        size='small'
                                        variant='outlined'
                                        onClick={() => {
                                            setEventToEdit(event);
                                            setOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                                <SnackbarForDelete
                                    open={openSnackbar}
                                    onClose={handleCloseSnackbar}
                                    onClickYes={() => handleClickYes(event.id)}
                                    onClick={handleCloseSnackbar}
                                    message={'Are you sure you want to delete this event?'}
                                />
                                <Box sx={{ mr: 1 }}>
                                    <Button
                                        startIcon={<DeleteForeverIcon />} color='error'
                                        size='small'
                                        variant='outlined'
                                        onClick={() => {
                                            setOpenSnackbar(true)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        }
                    </Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                        {event.location}
                    </Typography>
                    <Divider />
                    <Typography color='text.secondary' variant="caption" >
                        {format(parseISO(event.startTime), 'Pp')}
                    </Typography>
                </Box>

                {/* </Box> */}
            </CardContent>
        </Card>

    );
}