import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PieChart from "./PieChart";
import CircularLoading from '../Loading/CircularLoading'
import AddExpense from "./AddExpense";
import SettleUp from './SettleUp';
/////////////// DATE FORMATTER  ////////////////
import { format, parseISO } from "date-fns";

////////////////// MATERIAL UI /////////////////
import { Box, Button, Container, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Tooltip } from "@mui/material";

import { FaFileInvoiceDollar } from 'react-icons/fa'
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddIcon from '@mui/icons-material/Add';
import CardTravelIcon from '@mui/icons-material/CardTravel';
// const Expenses = ({ tripId, trip }) => {
const Expenses = ({match}) => {
    const tripId = match.params.id;
    const trip = useSelector(state => state.trips.find(trip => trip.tripId === tripId));
    const categories = useSelector(state => state.categories);
    const tripExpenses = useSelector(state => state.expenses.filter(expense => expense.tripId === tripId));
    const tableRowData = tripExpenses.map(expense => ({
        id: expense.id,
        description: expense.name,
        amount: expense.amount,
        category: expense.category.name,
        paidby: expense.paidBy.username,
        datepaid: expense.datePaid
    }))

    ///////////// SORTING AND PAGINATION STATES /////////////////
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('datepaid');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //////////// SORTING //////////////////
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    ///////////////// PAGINATION ////////////////////
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableRowData.length) : 0;

    ///////////////// DIALOG BOX ///////////////////
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }

    ///////////////// LOADING ///////////////////
    if (!trip) {
        return <CircularLoading />
    } else {
        if (tripExpenses.length === 0) return (
            <Container>
                <Dialog open={open} onClose={handleClose}>
                    <AddExpense trip={trip} handleClose={handleClose}/>
                </Dialog>
                <Button sx={{ml: 1, mt: 1, color: 'green'}}  variant='outlined' fontSize='large' startIcon={<AddIcon />}  onClick={() => setOpen(true)} >
                    Add Expense
                </Button>
            </Container>
        )
    }


    return (
        <Container>
            <Box className='linkToTrip' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <CardTravelIcon fontSize='medium' />
                <Box sx={{ color: 'inherit' }} component={Link} to={`/trips/${trip.tripId}`}>
                    <Typography variant='h5'>
                        &nbsp;{trip.trip.name}
                    </Typography>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <AddExpense trip={trip} handleClose={handleClose}/>
            </Dialog>
            <Button sx={{mb: 1, mt: 1, color: 'green'}}  variant='outlined' fontSize='large' startIcon={<AddIcon />}  onClick={() => setOpen(true)} >
                Add Expense
            </Button>
            <TableContainer component={Paper} sx={{border: '1px solid darkgrey'}}>
                <Table aria-label="trip expenses table">
                    <TableHead>
                        {/* <Tooltip title='Add Expense'> */}
                            {/* <AddBoxIcon onClick={() => setOpen(true)} sx={{color: 'green'}}/> */}
                            
                        {/* </Tooltip> */}
                        <TableRow>
                            <TableCell
                                align="center"
                                sortDirection={orderBy === "description" ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === "description"}
                                    direction={orderBy === "description" ? order : "asc"}
                                    onClick={createSortHandler("description")}
                                >
                                    Description
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                align="center"
                                sortDirection={orderBy === "amount" ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === "amount"}
                                    direction={orderBy === "amount" ? order : "asc"}
                                    onClick={createSortHandler("amount")}
                                >
                                    Amount
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                align="center"
                                sortDirection={orderBy === "category" ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === "category"}
                                    direction={orderBy === "category" ? order : "asc"}
                                    onClick={createSortHandler("category")}
                                >
                                    Category
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                align="center"
                                sortDirection={orderBy === "paidby" ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === "paidby"}
                                    direction={orderBy === "paidby" ? order : "asc"}
                                    onClick={createSortHandler("paidby")}
                                >
                                    Paid By
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                align="center"
                                sortDirection={orderBy === "datepaid" ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === "datepaid"}
                                    direction={orderBy === "datepaid" ? order : "asc"}
                                    onClick={createSortHandler("datepaid")}
                                >
                                    Date Paid
                                </TableSortLabel>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRowData.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell aligna="center"> {expense.description}</TableCell>
                                <TableCell align="center">${expense.amount}</TableCell>
                                <TableCell align="center">{expense.category}</TableCell>
                                <TableCell align="center">{expense.paidby}</TableCell>
                                <TableCell align="center">{format(parseISO(expense.datepaid), 'P')}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={5} />
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell align='right' sx={{fontWeight: 'bold'}}>Total:</TableCell>
                            <TableCell align='center' sx={{fontWeight: 'bold'}}>${tripExpenses.reduce((total, expense) => (total + +expense.amount), 0).toFixed(2)}</TableCell>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                        </TableRow>
                        <TableRow>
                            <TableCell align='right' sx={{fontWeight: 'bold'}}>Each Person Owes:</TableCell>
                            <TableCell align='center' sx={{fontWeight: 'bold'}}>${(tripExpenses.reduce((total, expense) => (total + +expense.amount), 0)/trip.trip.userTrips.length).toFixed(2)}</TableCell>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                        </TableRow>
                        <SettleUp expenses={tripExpenses} users={trip.trip.userTrips} />
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tripExpenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <PieChart expenses={tripExpenses} users={trip.trip.userTrips} categories={categories}/>
        </Container>
    )
}

export default Expenses

