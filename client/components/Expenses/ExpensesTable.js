import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PieChart from "./PieChart";
import CircularLoading from '../Loading/CircularLoading'
import AddExpense from "./AddExpense";
import { UserAvatar } from "../Trip/TripComponents";
/////////////// DATE FORMATTER  ////////////////
import { format, parseISO } from "date-fns";

////////////////// MATERIAL UI /////////////////
import { Avatar, Box, Button, Container, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Tooltip } from "@mui/material";

import { FaFileInvoiceDollar } from 'react-icons/fa'
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddIcon from '@mui/icons-material/Add';
import CardTravelIcon from '@mui/icons-material/CardTravel';


// const ExpensesTable = ({tripExpenses, trip}) => {
const ExpensesTable = ({expenses}) => {

    ///////////////// LOADING ///////////////////
    if (!expenses) {
        return <CircularLoading />
    } 
    const rows = expenses
    // console.log(rows)
    return (
    <TableContainer component={Paper}>
        {/* <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} size='small' aria-label="expenses table"> */}
        <Table size='small' aria-label="expenses table">
            <TableHead>
                <TableRow >
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Date</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Amount</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Description</TableCell>
                    <TableCell align='center' sx={{fontWeight: 'bold', fontSize: 15}}>Paid By</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id + Math.random().toString(16)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell>
                        {format(parseISO(row.datePaid), 'P')}
                    </TableCell>
                    <TableCell>
                        ${(+row.amount).toFixed(2)}
                    </TableCell>
                    <TableCell >
                        {row.name}
                    </TableCell>
                    <TableCell align='center'>
                        <UserAvatar user={row.paidBy} />
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
    
}

export default ExpensesTable

