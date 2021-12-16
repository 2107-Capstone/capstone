import React from 'react'

////////////////// UI //////////////////////
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { format, formatISO, parseISO, isAfter, isBefore } from "date-fns";
import CircularLoading from '../Loading/CircularLoading';
import UserAvatar from '../Trip/Components/UserAvatar';

const MessagesTable = ({ messages }) => {

    if (!messages) {
        <CircularLoading />
    }
    let recentMessages = messages.sort((a, b) => isBefore(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);
    recentMessages.length > 5 ? recentMessages.length = 5 : ''
    recentMessages = recentMessages.sort((a, b) => isAfter(new Date(a.dateSent), new Date(b.dateSent)) ? 1 : -1);

    const rows = recentMessages

    return (
        <TableContainer component={Paper}>
            <Table size='small' aria-label="messages table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: 15 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: 15 }}>Time</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: 15 }}>Sender</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: 15 }}>Message</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{ color: 'text.secondary' }}>
                                {format(parseISO(row.dateSent), 'P')}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                                {format(parseISO(row.dateSent), 'p')}
                            </TableCell>
                            <TableCell align='center' sx={{ color: 'text.secondary' }}>
                                <UserAvatar user={row.sentBy} />
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{row.content}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MessagesTable