import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Checkbox, Avatar, Button, Tooltip, FormGroup, IconButton, FormControlLabel, Divider, List, Snackbar, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

////////////// STORE ////////////////
import { getUserDebts, editUserDebt } from '../../store'

import CircularLoading from "../Loading/CircularLoading";
import TripDebts from "./TripDebts";

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

    const auth = useSelector(state => state.auth)

    const debts = useSelector(state => state.userDebts)
    const userDebts = debts.filter(debt => debt.status === 'pending' && (debt.payeeId === auth.id || debt.payorId === auth.id))
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
    const [checked, setChecked] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleClose = () => {
        setOpenSnackbar(false)
    }

    if (userDebts.length === 0) {
        return (
            <Typography align='center' variant='h6' sx={{ mt: 4, mb: 8 }}>
                No money owed
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
                                                    <TripDebts key={idx} info={info} debt={debt} user={user} />
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
