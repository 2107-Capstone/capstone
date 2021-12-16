import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

/////////////// MATERIAL UI ///////////////////////
import { Box, Checkbox, Avatar, Button, Tooltip, FormGroup, IconButton, FormControlLabel, Divider, List, Snackbar, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@emotion/react";
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

////////////// STORE ////////////////
import { getUserDebts, editUserDebt } from '../../store'
import CircularLoading from "../Loading/CircularLoading";

const TripDebts = ({ info, user, debt }) => {
    const dispatch = useDispatch()
    if (!info) {
        return (<CircularLoading />)
    }

    const handleClick = async (userDebt) => {
        dispatch(editUserDebt(userDebt))
        setChecked(false)
        setOpenSnackbar(false)
    }
    const [checked, setChecked] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleClose = () => {
        setOpenSnackbar(false)
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    return (
        <Fragment>
            <Box key={debt.id}
                sx={{ m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <Typography>
                    {debt.payor.username === user.username ? 'You owe' :
                        `${debt.payor.username} owes`}  {debt.payee.username === user.username ? ' you' : debt.payee.username} {formatter.format(+debt.amount)}
                </Typography>
                <Snackbar
                    sx={{ mt: 9 }}
                    open={openSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message={'Are you sure you want to mark this as paid?'}
                    action={
                        <>
                            <Button color="secondary" size="small" onClick={() => handleClick(debt)}>
                                YES
                            </Button>
                            <Button color="secondary" size="small" onClick={() => {
                                setChecked(!checked)
                                handleClose()
                            }}
                            >
                                NO
                            </Button>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={() => {
                                    setChecked(!checked)
                                    handleClose()
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    }
                />
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
                                    checked={checked}
                                    onChange={() => {
                                        setChecked(true)
                                        setOpenSnackbar(true)
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    color="success"
                                />}
                            label="Paid" />
                    </FormGroup>
                </Tooltip>
            </Box>
        </Fragment>

    )
}

export default TripDebts
