import React from "react"
import { Container, Typography, TableRow, TableCell } from "@mui/material";
import DoubleArrowRoundedIcon from '@mui/icons-material/DoubleArrowRounded';

const SettleUp = ({expenses, users}) => {
//TODO: rounding error
    const payments = {};
    const findTotal = (userId) => expenses.reduce((total, expense) => {
        if (expense.paidById === userId) {
            total += +expense.amount;
        }
        return total;
    }, 0)

    users.forEach(user => payments[user.user.username] = findTotal(user.userId));
    
    const payors = Object.keys(payments);
    const paid = Object.values(payments);
    const totalExpenses = paid.reduce((total, amount) => total + amount)
    const eachPersonOwes = totalExpenses / payors.length;
    
    const sortedPayors = payors.sort((a,b) => payments[a] - payments[b]);
    const sortedPaid = sortedPayors.map(payor => payments[payor] - eachPersonOwes);

    let i = 0, j = sortedPayors.length - 1, diff;
    const returnString = [];

    while (i < j) {
    //compare person who owes the most with person who owes the least
        diff = Math.min(-(sortedPaid[i]), sortedPaid[j]);
        sortedPaid[i] += diff;
        sortedPaid[j] -= diff;
        
        returnString.push([sortedPayors[i], sortedPayors[j], diff.toFixed(2)])

        sortedPaid[i] === 0 ? i++ : '';
        sortedPaid[j] === 0 ? j-- : '';
    }

    return (
        // <Container>
            
                returnString.map(string => (
                    <TableRow key={Math.random().toString(16)}>
                        <TableCell colSpan={5} align='left' style={{fontWeight: 'bold', fontStyle: 'italic'}}>
                            {string[0]} owes {string[1]} ${string[2]}
                        </TableCell>
                    </TableRow>
                ))
            
        // </Container>
    )
}

export default SettleUp