import React from "react"
import { CircularProgress, Box, Typography } from "@mui/material"


const CircularLoading = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <CircularProgress size={50} />
            <Typography>
                LOADING...
            </Typography>
        </Box>
    )
}
export default CircularLoading