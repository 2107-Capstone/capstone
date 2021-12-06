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

const MessagesTable = ({messages}) => {
    const rows = messages
    return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} aria-label="events table">
            <TableHead>
                <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Sender</TableCell>
                    <TableCell>Message</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {format(parseISO(row.dateSent), 'Pp')}
                    </TableCell>
                    <TableCell >{row.sentBy.username}</TableCell>
                    <TableCell >{row.content}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default MessagesTable