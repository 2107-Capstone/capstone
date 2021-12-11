import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PieChart from "./PieChart";
import CircularLoading from '../Loading/CircularLoading'
import AddExpense from "./AddExpense";
// import SettleUp from './SettleUp';
/////////////// DATE FORMATTER  ////////////////
import { format, parseISO } from "date-fns";

////////////////// MATERIAL UI /////////////////
import { Box, Button, Container, Checkbox, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Tooltip } from "@mui/material";

import { FaFileInvoiceDollar } from 'react-icons/fa'
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddIcon from '@mui/icons-material/Add';
import CardTravelIcon from '@mui/icons-material/CardTravel';


// const ExpensesTable = ({tripExpenses, trip}) => {
const TripDebts = ({tripDebts}) => {
    
    ///////////////// LOADING ///////////////////
    if (!tripDebts) {
        return <CircularLoading />
    } 
    const rows = tripDebts
    return (
    <TableContainer component={Paper}>
        {/* <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} size='small' aria-label="debt table"> */}
        <Table size='small' aria-label="debt table">
            
            <TableHead>
                <TableRow >
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Debtor</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Amount</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Creditor</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Paid</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell>
                        {row.payor.username}
                    </TableCell>
                    <TableCell>
                        ${(+row.amount).toFixed(2)}
                    </TableCell>
                    <TableCell >
                        {row.payee.username}
                    </TableCell>
                    <TableCell >
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

