import React from "react";
import CircularLoading from '../Loading/CircularLoading'
import UserAvatar from "../Trip/Components/UserAvatar";
/////////////// DATE FORMATTER  ////////////////
import { format, parseISO, isBefore, isAfter } from "date-fns";

////////////////// MATERIAL UI /////////////////
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const ExpensesTable = ({expenses, numUsers}) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    ///////////////// LOADING ///////////////////
    if (!expenses) {
        return <CircularLoading />
    }
    
    const totalExpenses = expenses.reduce((total, expense) => {
        return total + +expense.amount
    }, 0);
    const eachPersonOwes = totalExpenses / numUsers;
    let recentExpenses = expenses.sort((a, b) => isBefore(new Date(a.datePaid), new Date(b.datePaid)) ? 1 : -1);
    recentExpenses.length > 5 ? recentExpenses.length = 5 : ''
    recentExpenses = recentExpenses.sort((a,b) => isAfter(new Date(a.datePaid), new Date(b.datePaid)) ? 1 : -1);

    const rows = recentExpenses;
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mx: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, mb: 2, textAlign: 'center' }}>
                <Typography variant='subtitle2'>
                    Total Expenses: {formatter.format(totalExpenses)}
                </Typography>
                <Typography variant='subtitle2'>
                    Each Person Owes: {formatter.format(eachPersonOwes)}
                </Typography>
            </Box>
            <TableContainer component={Paper}>
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
                            <TableCell sx={{color: 'text.secondary'}}>
                                {format(parseISO(row.datePaid), 'P')}
                            </TableCell>
                            <TableCell sx={{color: 'text.secondary'}}>
                                {formatter.format(+row.amount)}
                            </TableCell>
                            <TableCell  sx={{color: 'text.secondary'}}>
                                {row.name}
                            </TableCell>
                            <TableCell align='center' sx={{color: 'text.secondary'}}>
                                <UserAvatar user={row.paidBy} />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>   
    )
    
}

export default ExpensesTable

