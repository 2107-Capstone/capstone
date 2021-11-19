import React from "react"
import { LinearProgress, Box, Typography } from "@mui/material"

const LinearLoading = () => {
    return (
        <Box sx={{ width: '50%' }}>
            <LinearProgress />
            <Typography>
                LOADING...
            </Typography>
        </Box>
    )
}
export default LinearLoading