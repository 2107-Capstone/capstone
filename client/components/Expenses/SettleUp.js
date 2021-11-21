import React from "react"
import { Container, Typography } from "@mui/material";
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

        returnString.push(`${sortedPayors[i]} owes ${sortedPayors[j]} $${diff.toFixed(2)}`)

        sortedPaid[i] === 0 ? i++ : '';
        sortedPaid[j] === 0 ? j-- : '';
    }

    return (
        <Container>
            <Typography variant='h6'>
                Total Expenses: ${totalExpenses}
            </Typography>
            <Typography variant='h6'>
                Each Person Owes: ${eachPersonOwes.toFixed(2)}
            </Typography>
            {
                returnString.map(string => (
                    <Typography>
                        {string}
                    </Typography>
                ))
            }
        </Container>
    )
}

export default SettleUp