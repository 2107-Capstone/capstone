import React from "react"

import { Snackbar, Button, IconButton, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarForDelete = ({ open, onClose, onClickYes, onClick, message }) => {

    return (
        <Snackbar
            sx={{ mt: 9 }}
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={6000}
            onClose={onClose}
            message={message}
            action={
                <>
                    <Button color="secondary" size="small" onClick={onClickYes}>
                        YES
                    </Button>
                    <Button color="secondary" size="small" onClick={onClick}>
                        NO
                    </Button>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={onClick}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            }
        />
    )
}

export default SnackbarForDelete