import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Avatar, Button, Divider, List, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

/////////////// COMPONENTS ///////////////////

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

    const Debts = useSelector(state => state.userDebts)
    const userDebts = Debts.filter(debt => debt.status === 'pending')
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
                You do not have any unpaid expenses.
            </Typography>
        )
    }

    return (
        <List sx={{ mt: 4, mb: 4 }}>
            <Typography align='center' >
                (The person owed can mark an expense as paid.)
            </Typography>
            {Object.entries(tripDebts).map((trip, idx) => (
                <Fragment key={idx}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* <Avatar src={debt.trip.imageUrl} /> */}
                        {trip.map((info, idx) => (
                            idx === 0 ?
                                <Typography key={idx} sx={{ fontWeight: 'bold' }} variant='h6'>
                                    {info}
                                </Typography>
                                :
                                <List key={idx}>
                                    {
                                        info.map((debt, idx) => (
                                            <Box key={idx} sx={{ m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography>
                                                    {debt.payor.username} owes {debt.payee.username} ${(+debt.amount).toFixed(2)}
                                                </Typography>
                                                <Button sx={{mx:1}} startIcon={<CheckIcon />} onClick={() => handleClick(debt)} size="small" variant='outlined' color='success' disabled={debt.payee.id !== user.id}>
                                                    PAID
                                                </Button>
                                            </Box>
                                        ))
                                    }
                                </List>
                        ))}
                    </Box>
                    <Divider />
                </Fragment>
            ))
            }
        </List >
    )
}

export default Debts
