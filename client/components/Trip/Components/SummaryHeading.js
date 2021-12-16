import React from 'react'
import { Link } from 'react-router-dom'

/////////////// MUI /////////////////
import { Box, Typography, Button } from '@mui/material';

/////////////// ICONS /////////////////
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import theme from '../../../theme';

export const SummaryHeading = ({ name, icon, link }) => {

    return (
        <Box style={name === 'Debt Summary' ? styles.debtHeadingIcon : styles.heading} sx={{ display: 'flex' }}>
            <Box >
                {
                    name !== 'Debt Summary' &&
                    <Button sx={{ ':hover': { backgroundColor: 'secondary.main', color: 'text.primary', boxShadow: (theme) => theme.shadows[5] } }} component={Link} to={link} startIcon={<OpenInNewIcon />} >
                        Details
                    </Button>
                }
            </Box>
            <Box style={styles.headingIcon}>
                {icon}
                <Typography variant='h6'>
                    &nbsp;{name === 'Debt Summary' ? name : `${name} Snapshot`}
                </Typography>
            </Box>
        </Box>
    )
}

export default SummaryHeading

const styles = {
    headingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.palette.primary.main,
        // border: `2px solid ${theme.palette.primary.main}`,
        flexGrow: 1,
        // color: 'white',
        borderRadius: 7
    },
    heading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `3px solid ${theme.palette.primary.main}`,
        flexGrow: 1,
        // color: 'white',
        borderRadius: 7
    },
    debtHeadingIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        flexGrow: 1,
        color: 'white',
        borderRadius: 7
    },
}
