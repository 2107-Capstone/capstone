import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Checkbox, Avatar, Button, Tooltip, FormGroup, FormControlLabel, Divider, List, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

////////////// STORE ////////////////
import { getUserDebts, editUserDebt } from '../../store'
import CircularLoading from "../Loading/CircularLoading";

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

    const debts = useSelector(state => state.userDebts)
    const userDebts = debts.filter(debt => debt.status === 'pending')
    const user = useSelector(state => state.auth)

    if (!user || !closedTrips || !userDebts) {
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
            <Typography align='center' variant='h6' sx={{ mt: 4, mb: 8 }}>
                No unpaid debts
            </Typography>
        )
    }

    return (
        <List sx={{ mt: 4, mb: 4 }}>
            {
                Object.entries(tripDebts).map((trip, idx) => (
                    <Fragment key={idx}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
                            {
                                trip.map((info, idx) => (
                                    idx === 0 ?
                                        <Typography key={idx} sx={{ fontWeight: 'bold' }} variant='h6'>
                                            {info}
                                        </Typography>
                                        :
                                        <List key={idx}>
                                            {
                                                info.map((debt, idx) => (
                                                    <Fragment key={idx}>
                                                        <Box key={debt.id}
                                                            sx={{ m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                                        >
                                                            <Typography>
                                                                {debt.payor.username === user.username ? 'You owe' : 
                                                                `${debt.payor.username} owes`}  {debt.payee.username === user.username ? ' you' : debt.payee.username} ${(+debt.amount).toFixed(2)}
                                                            </Typography>
                                                            <Tooltip 
                                                                title={debt.payee.username !== user.username ? `Only ${debt.payee.username} can mark this as paid.` : ''}
                                                                enterTouchDelay={100}
                                                                leaveTouchDelay={900}
                                                            >
                                                                <FormGroup>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                sx={{ ml: 1 }}
                                                                                disabled={debt.payee.username !== user.username}
                                                                                onChange={() => handleClick(debt)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                color="success"
                                                                            />}
                                                                        label="Paid" />
                                                                </FormGroup>
                                                            </Tooltip>
                                                        </Box>
                                                    </Fragment>
                                                ))
                                            }
                                        </List>
                                ))
                            }
                            {/* </Box> */}
                        </Box>
                        <Divider />
                    </Fragment>
                ))
            }
        </List >
    )
}

export default Debts
