import React from "react";

import CircularLoading from '../Loading/CircularLoading'
import UserAvatar from "../Trip/Components/UserAvatar";

////////////////// MATERIAL UI /////////////////
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const TripDebts = ({trip, type}) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })
    ///////////////// LOADING ///////////////////
    if (!trip) {
        return <CircularLoading />
    }

    const rows = type === 'admin' ? trip.userDebts : trip.trip.userDebts

    if (rows.length === 0){
        return (
            <Typography ml={1}>
                No one owes any money.
            </Typography>
        )
    }
    return (
    <TableContainer component={Paper}>
        {/* <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} size='small' aria-label="debt table"> */}
        <Table size='small' aria-label="debt table">
            
            <TableHead>
                <TableRow >
                    <TableCell align="center" sx={{fontWeight: 'bold', fontSize: 15}}>Debtor</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Amount</TableCell>
                    <TableCell align="center" sx={{fontWeight: 'bold', fontSize: 15}}>Creditor</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Paid</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="center"  sx={{color: 'text.secondary'}}>
                        <UserAvatar user={row.payor} />
                    </TableCell>
                    <TableCell sx={{color: 'text.secondary'}}>
                        {formatter.format(+row.amount)}
                    </TableCell>
                    <TableCell align="center" sx={{color: 'text.secondary'}}>
                        <UserAvatar user={row.payee} />
                    </TableCell>
                    <TableCell  sx={{color: 'text.secondary'}}>
                        <Checkbox checked={row.status !== 'pending'} disabled/>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default TripDebts

