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
import { Box, Button, Container, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Tooltip } from "@mui/material";

import { FaFileInvoiceDollar } from 'react-icons/fa'
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddIcon from '@mui/icons-material/Add';
import CardTravelIcon from '@mui/icons-material/CardTravel';


// const ExpensesTable = ({tripExpenses, trip}) => {
const ExpensesTable = ({tripExpenses}) => {

    console.log(tripExpenses)
    ///////////////// LOADING ///////////////////
    if (!tripExpenses) {
        return <CircularLoading />
    } 
    const rows = tripExpenses
    return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, ml: 1, mr: 1 }} size='small' aria-label="expenses table">
            <colgroup>
                <col style={{width: '10%'}} />
                <col style={{width: '10%'}} />
                <col style={{width: 'auto'}} />
                {/* <col style={{width: 'auto'}} /> */}
            </colgroup>
            <TableHead>
                <TableRow >
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Date</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Amount</TableCell>
                    <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Description</TableCell>
                    {/* <TableCell sx={{fontWeight: 'bold', fontSize: 15}}>Paid By</TableCell> */}
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
                    {/* <TableCell >
                        {row.paidBy.username}
                    </TableCell> */}
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
    // return (
    //     <Container>
    //         <TableContainer component={Paper} sx={{border: '1px solid darkgrey'}}>
    //             <Table aria-label="trip expenses table">
    //                 <TableHead>
                 
    //                     <TableRow>
    //                         <TableCell
    //                             align="center"
    //                             sortDirection={orderBy === "description" ? order : false}
    //                         >
    //                             <TableSortLabel
    //                                 active={orderBy === "description"}
    //                                 direction={orderBy === "description" ? order : "asc"}
    //                                 onClick={createSortHandler("description")}
    //                             >
    //                                 Description
    //                             </TableSortLabel>
    //                         </TableCell>

    //                         <TableCell
    //                             align="center"
    //                             sortDirection={orderBy === "amount" ? order : false}
    //                         >
    //                             <TableSortLabel
    //                                 active={orderBy === "amount"}
    //                                 direction={orderBy === "amount" ? order : "asc"}
    //                                 onClick={createSortHandler("amount")}
    //                             >
    //                                 Amount
    //                             </TableSortLabel>
    //                         </TableCell>

    //                         <TableCell
    //                             align="center"
    //                             sortDirection={orderBy === "category" ? order : false}
    //                         >
    //                             <TableSortLabel
    //                                 active={orderBy === "category"}
    //                                 direction={orderBy === "category" ? order : "asc"}
    //                                 onClick={createSortHandler("category")}
    //                             >
    //                                 Category
    //                             </TableSortLabel>
    //                         </TableCell>

    //                         <TableCell
    //                             align="center"
    //                             sortDirection={orderBy === "paidby" ? order : false}
    //                         >
    //                             <TableSortLabel
    //                                 active={orderBy === "paidby"}
    //                                 direction={orderBy === "paidby" ? order : "asc"}
    //                                 onClick={createSortHandler("paidby")}
    //                             >
    //                                 Paid By
    //                             </TableSortLabel>
    //                         </TableCell>

    //                         <TableCell
    //                             align="center"
    //                             sortDirection={orderBy === "datepaid" ? order : false}
    //                         >
    //                             <TableSortLabel
    //                                 active={orderBy === "datepaid"}
    //                                 direction={orderBy === "datepaid" ? order : "asc"}
    //                                 onClick={createSortHandler("datepaid")}
    //                             >
    //                                 Date Paid
    //                             </TableSortLabel>
    //                         </TableCell>

    //                     </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                     {tableRowData.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense) => (
    //                         <TableRow key={expense.id}>
    //                             <TableCell aligna="center"> {expense.description}</TableCell>
    //                             <TableCell align="center">${expense.amount}</TableCell>
    //                             <TableCell align="center">{expense.category}</TableCell>
    //                             <TableCell align="center">{expense.paidby}</TableCell>
    //                             <TableCell align="center">{format(parseISO(expense.datepaid), 'P')}</TableCell>
    //                         </TableRow>
    //                     ))}
    //                     {emptyRows > 0 && (
    //                         <TableRow
    //                             style={{
    //                                 height: 53 * emptyRows,
    //                             }}
    //                         >
    //                             <TableCell colSpan={5} />
    //                         </TableRow>
    //                     )}
    //                     <TableRow>
    //                         <TableCell align='right' sx={{fontWeight: 'bold'}}>Total:</TableCell>
    //                         <TableCell align='center' sx={{fontWeight: 'bold'}}>${tripExpenses.reduce((total, expense) => (total + +expense.amount), 0).toFixed(2)}</TableCell>
    //                         <TableCell/>
    //                         <TableCell/>
    //                         <TableCell/>
    //                     </TableRow>
    //                     <TableRow>
    //                         <TableCell align='right' sx={{fontWeight: 'bold'}}>Each Person Owes:</TableCell>
    //                         <TableCell align='center' sx={{fontWeight: 'bold'}}>${(tripExpenses.reduce((total, expense) => (total + +expense.amount), 0)/trip.trip.userTrips.length).toFixed(2)}</TableCell>
    //                         <TableCell/>
    //                         <TableCell/>
    //                         <TableCell/>
    //                     </TableRow>
    //                     {/* <SettleUp expenses={tripExpenses} users={trip.trip.userTrips} /> */}
    //                 </TableBody>
    //             </Table>
    //         </TableContainer>
    //         <TablePagination
    //             rowsPerPageOptions={[5, 10, 25]}
    //             component="div"
    //             count={tripExpenses.length}
    //             rowsPerPage={rowsPerPage}
    //             page={page}
    //             onPageChange={handleChangePage}
    //             onRowsPerPageChange={handleChangeRowsPerPage}
    //         />
    //         {/* <PieChart expenses={tripExpenses} users={trip.trip.userTrips} categories={categories}/> */}
    //     </Container>
    // )
}

export default ExpensesTable

