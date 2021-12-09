import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Checkbox, Avatar, Button, Tooltip, FormGroup, FormControlLabel, Divider, List, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

/////////////// COMPONENTS ///////////////////

////////////// STORE ////////////////
import {  getUserDebts, editUserDebt } from '../../store'



const Debts = () => {
    ///////////// Media Query /////////////
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    let flexdirection = 'row'
    if (matches) {
        flexdirection = 'column'
    }
    else {
        flexdirection = 'row'
    }

    const dispatch = useDispatch()
    const closedTrips = useSelector(state => state.trips.filter(trip => !trip.trip.isOpen));

    useEffect(async () => {
        try {
            await dispatch(getUserDebts())
        } catch (error) {
            console.log(error)
        }
    }, [])

    const userDebts = useSelector(state => state.userDebts.filter(debt => debt.status === 'pending'))

    const auth = useSelector(state => state.auth)
    
    if ( !auth || !closedTrips || !userDebts) {
        return (<CircularLoading />)
    }

    let tripDebts = {};
    userDebts.forEach(debt => {
        !tripDebts[debt.trip.name] ? tripDebts[debt.trip.name] = [debt] : tripDebts[debt.trip.name].push(debt)
    })

    const handleClick = async (userDebt) => {
        dispatch(editUserDebt(userDebt))
    }

    if (userDebts.length === 0) {
        return (
            <Typography align='center' variant='h6'>
                You do not have any unpaid expenses.
            </Typography>
        )
    }

    return (
        <List textAlign='center'>
            {/* <Typography align='center' >
                (The person owed can mark an expense as paid.)
            </Typography> */}
            {Object.entries(tripDebts).map(trip => (
                <Fragment key={Math.random().toString(16)}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: `${flexdirection}`
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* <Avatar src={debt.trip.imageUrl} /> */}
                    {trip.map((info, idx) => (
                        idx === 0 ?
                            <Typography sx={{fontWeight: 'bold'}} variant='h6'>
                                {info}
                            </Typography>
                            
                        :
                            // <Box sx={{ m: 1 }}>
                                <List>
                                    {
                                        info.map((debt) => (
                                            <>
                                            <Box sx={{ '& button': { m: .5 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography>
                                                {debt.payor.username === auth.username ? 'You owe' : `${debt.payor.username} owes`}  {debt.payee.username === auth.username ? ' you' : debt.payee.username} ${(+debt.amount).toFixed(2)}
                                            </Typography>
                                            <Tooltip title={`${debt.payee.username} can mark this as paid.`}>
                                                <FormGroup>
                                                    <FormControlLabel 
                                                        control={
                                                            <Checkbox 
                                                                sx={{ml: 1}}
                                                                disabled={debt.payee.username !== auth.username}
                                                                onChange={() => handleClick(debt)}
                                                                inputProps={{ 'aria-label' : 'controlled' }}
                                                                color="success"
                                                            />} 
                                                        label="Paid" />
                                                </FormGroup>
                                            </Tooltip>
                                                {/* <Button  startIcon={<CheckIcon />} onClick={() => handleClick(debt)} size="small" variant='outlined' color='success' disabled={debt.payee.username !== auth.username}>
                                                    PAID
                                                </Button> */}
                                            </Box>
                                            </>
                                        ))
                                    }
                                </List>
                                
                    ))}
                        </Box>
                    </Box>

                    <Divider />
                </Fragment>
            ))
            }
        </List >
    )
}

export default Debts
