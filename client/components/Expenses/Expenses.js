import React, { useState } from "react";
import { useSelector } from "react-redux";

import AddExpense from "./AddExpense";

/////////////// DATE FORMATTER  ////////////////
import { format, parseISO } from "date-fns";

////////////////// MATERIAL UI /////////////////
import { Button, Container, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";

const Expenses = ({ tripId, trip }) => {
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    ///////////////// DIALOG BOX ///////////////////
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }

    ///////////////// LOADING ///////////////////
    if (!tripExpenses) {
        if (tripExpenses.length === 0) return <h1>No expenses</h1>
    } else {
        if (tripExpenses.length === 0) return <h1>...Loading</h1>
    }


    return (
        <Container>
            <Dialog open={open}>
                <AddExpense trip={trip} handleClose={handleClose}/>
            </Dialog>
            <Button onClick={() => setOpen(true)}>Add Expense</Button>
            <TableContainer component={Paper}>
                <Table aria-label="trip expenses table">
                    <TableHead>
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
        </Container>
    )
}

export default Expenses


// import MaterialTable from 'material-table';
// import AddBox from '@mui/icons-material/AddBox';
// import ArrowDownward from '@mui/icons-material/ArrowDownward';
// import Check from '@mui/icons-material/Check';
// import ChevronLeft from '@mui/icons-material/ChevronLeft';
// import ChevronRight from '@mui/icons-material/ChevronRight';
// import Edit from '@mui/icons-material/Edit';
// import FilterList from '@mui/icons-material/FilterList';
// import FirstPage from '@mui/icons-material/FirstPage';
// import LastPage from '@mui/icons-material/LastPage';
// import Remove from '@mui/icons-material/Remove';
// import SaveAlt from '@mui/icons-material/SaveAlt';
// import Search from '@mui/icons-material/Search';
// import Delete from '@mui/icons-material/Delete';
// import ViewColumn from '@mui/icons-material/ViewColumn';
// const expenses = useSelector(state => state.expenses.filter(expense => expense.tripId === tripId).sort((a, b) => a.datePaid < b.datePaid ? -1 : 1));


// const tableIcons = {
//     Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
//     Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
//     DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
//     Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} /> ),
//     Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
//     Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
//     Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
//     FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
//     LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
//     NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
//     PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
//     ResetSearch: forwardRef((props, ref) => ''),
//     Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
//     SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
//     ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
//     ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
// };

// const columns = [
//     { title: 'Description', field: 'name',
//         cellStyle: {
//             width: 20,
//             maxWidth: 20,
//         },
//         headerStyle: {
//             width: 20,
//             maxWidth: 20
//         }
//     },
//     { title: 'Amount', field: 'amount', type: 'currency' },
//     { title: 'Category', field: 'category' },
//     { title: 'Paid By', field: 'paidBy' },
//     { title: 'Date Paid', field: 'datePaid', type: 'date' }
// ];
// const data = expenses.map( expense => (
//     {
//         name: expense.name,
//         amount: expense.amount,
//         category: expense.category.name,
//         paidBy: expense.paidBy.username,
//         datePaid: expense.datePaid,
//         id: expense.id
//     }
// ));

// <h1>Testing</h1>
//     <MaterialTable
//     title='Expenses'
//     icons={tableIcons}
//     columns={columns}
//     data={data}
//     options={{
    //         filtering: true,
//         grouping: true,
//         search: true,
//         toolbarButtonAlignment: 'left',
//         pageSize: 10,
//         pageSizeOptions: [10, 20, 30],
//         headerStyle: {
//             color: 'darkslate',
//             background: '#D7EBF8',
//         }
//     }}
//     style={{
//         margin: '1rem',
//     }}

// />
// <ol>
//     {
//         expenses.map(expense => (
//             <li key={expense.id + Math.random().toString(16)}>
//                 ({format(parseISO(expense.datePaid), 'P')}): {expense.name}: ${(+expense.amount).toFixed(2)}
//                 <br></br>
//                 Paid By: {expense.paidBy.username}
//             </li>
//         ))
//     }
// </ol>