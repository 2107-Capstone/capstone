import React from 'react';
import CircularLoading from '../Loading/CircularLoading'
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
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: usersLabels.map((_,idx) => `rgb(0, 174, 255, ${idx * .1 + .1})`)
    }
]
    const datasets = [
        {
            data: categoriesData,
            backgroundColor: categories.map((_,idx) => `rgb(255, 0, 0, ${idx * .2 + .1})`),
            borderColor: 'white',
            borderWidth: 1
        }
    ]
    if (!users || !expenses || !categories) {
        return <CircularLoading />
    } else if (expenses.length === 0) {
        return ''
    } 
    
    return (
    // <div style={{display: 'flex', justifyContent: 'space-around'}}>
    //     <div>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} lg={6}>
                <Pie
                    options={{
                        // width: "200",
                        // height: "200",
                        plugins: {
                            title: {
                                display: true,
                                text: 'Expenses by Category',
                                color: 'white'
                            },
                            labels: {
                                color: 'white'
                            },
                            border: {
                                color: 'white'
                            }
                        },
                        responsive: true,
                        color: 'white',
                        aspectRatio: 1,
                        
                    }}
                    data={{
                        labels: categoriesLabels,
                        datasets: datasets
                    }}
                    />
            </Grid>       
            <Grid item xs={12} lg={6}>
                <Pie
                    options={{
                        // width: "200",
                        // height: "200",
                        plugins: {
                            title: {
                                display: true,
                                text: 'Expenses by Friend',
                                color: 'white'
                            }
                        },
                        responsive: true,
                        color: 'white',
                        aspectRatio: 1
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