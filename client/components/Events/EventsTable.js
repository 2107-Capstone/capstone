import React, { useEffect, useState } from 'react'


////////////////// UI //////////////////////
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import CircularLoading from '../Loading/CircularLoading';
import { format, formatISO, parseISO, isAfter } from "date-fns";

const EventsTable = ({events}) => {
    if (!events) return <CircularLoading />
    
    let recentEvents = events.sort((a, b) => isAfter(new Date(a.startTime), new Date(b.startTime)) ? 1 : -1);
    recentEvents.length > 5 ? recentEvents.length = 5 : ''

    const rows = recentEvents
    return (
    <TableContainer component={Paper}>
        <Table size='small' aria-label="events table">
            <TableHead>
                <TableRow >
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Date</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Time</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Event</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell sx={{color: 'text.secondary'}}>
                        {format(parseISO(row.startTime), 'P')}
                    </TableCell>
                    <TableCell sx={{color: 'text.secondary'}}>
                        {format(parseISO(row.startTime), 'p')}
                    </TableCell>
                    <TableCell  sx={{color: 'text.secondary'}}>{row.name}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default EventsTable