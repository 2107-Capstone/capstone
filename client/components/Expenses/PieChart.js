import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Box, Grid, Button, Paper, TextField, Typography, Dialog } from '@mui/material'
ChartJS.register(ArcElement, Tooltip, Legend, Title);
const PieChart = ({expenses, users, categories}) => {
   
    const usersLabels = users.map(user => user.user.username);
    const usersData = users.map(user => expenses.reduce((accum, expense) => {
        expense.paidById === user.userId ? accum += +expense.amount : '';
        return accum;
    }, 0));
    const categoriesLabels = categories.map(category => category.name);
    const categoriesData = categories.map(category => expenses.reduce((accum, expense) => {
        expense.categoryId === category.id ? accum += +expense.amount : '';
        return accum;
    }, 0));
    
const datasets2 = [
    {
        data: usersData,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: usersLabels.map((_,idx) => `rgb(8, 0, 255, ${idx * .1 + .1})`)
    }
]
    const datasets = [
        {
            data: categoriesData,
            backgroundColor: categories.map((_,idx) => `rgb(255, 0, 0, ${idx * .2 + .1})`),
            borderColor: 'black',
            borderWidth: 1
        }
    ]
    if (users.length === 0 || expenses.length === 0) return '...loading'
    return (
    // <div style={{display: 'flex', justifyContent: 'space-around'}}>
    //     <div>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={12} lg={6}>
                {/* <Paper style={{width: 150, height: 80}} sx={{ ':hover': { boxShadow: (theme) => theme.shadows[5] } }}> */}
                    {/* <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', flexDirection: 'column' }}> */}
                    <Pie
                        options={{
                            width: "400",
                            height: "400",
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Expenses by Category'
                                }
                            },
                            responsive: true,
                        }}
                        data={{
                            labels: categoriesLabels,
                            datasets: datasets
                        }}
                    />
                    {/* </Box>
                </Paper> */}
            </Grid>
        
            <Grid item xs={12} sm={12} lg={6}>
                <Pie
                    options={{
                        width: "400",
                        height: "400",
                        plugins: {
                            title: {
                                display: true,
                                text: 'Expenses by Friend'
                            }
                        },
                        responsive: true,
                    }}
                    data={{
                        labels: usersLabels,
                        datasets: datasets2
                    }}
                />
            </Grid>
        </Grid>
        
    )
}

export default PieChart