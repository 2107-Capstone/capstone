import React, { useEffect, useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, Box, Divider, Grid, Button, Paper, TextField, Tooltip, Typography, Dialog } from '@mui/material'
import CircularLoading from '../Loading/CircularLoading';
import { format, formatISO, parseISO, isAfter } from "date-fns";
import { UserAvatar } from '../Trip/TripComponents';
const MessagesTable = ({messages}) => {
    const rows = messages
    return (
    <TableContainer component={Paper}>
        {/* <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} size='small' aria-label="events table"> */}
        <Table size='small' aria-label="messages table">
            {/* <colgroup>
                <col style={{width: '5%'}} />
                <col style={{width: '5%'}} />
                <col style={{width: '10%'}} />
                <col style={{width: '80%'}} />
            </colgroup> */}
            <TableHead>
                <TableRow>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Date</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Time</TableCell>
                    <TableCell align='center' sx={{fontWeight: 'bold', fontSize: 15}}>Sender</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Message</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell sx={{color: 'text.secondary'}}>
                        {format(parseISO(row.dateSent), 'P')}
                    </TableCell>
                    <TableCell sx={{color: 'text.secondary'}}>
                        {format(parseISO(row.dateSent), 'p')}
                    </TableCell>
                    <TableCell align='center' sx={{color: 'text.secondary'}}>
                        <UserAvatar user={row.sentBy} />
                    </TableCell>
                    <TableCell sx={{color: 'text.secondary'}}>{row.content}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default MessagesTable