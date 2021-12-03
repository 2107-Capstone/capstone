import React, { useEffect, useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Divider, Grid, Button, Paper, TextField, Tooltip, Typography, Dialog } from '@mui/material'
import CircularLoading from '../Loading/CircularLoading';
import { format, formatISO, parseISO, isAfter } from "date-fns";

const EventsTable = ({events}) => {
    if (!events) return <CircularLoading />
    
    

    const rows = events
    return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} aria-label="events table">
            <TableHead>
                <TableRow>
                    Next Five Events
                </TableRow>
                <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {format(parseISO(row.startTime), 'Pp')}
                    </TableCell>
                    <TableCell >{row.name}</TableCell>
                    <TableCell >{row.location}</TableCell>
                    <TableCell >{row.description}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default EventsTable