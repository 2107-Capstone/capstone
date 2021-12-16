import React from 'react'
/////////////// MUI /////////////////
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import SummaryHeading from './SummaryHeading';

export const Summary = ({trip, type, link, summaryTable, tooltipMessage, icon, length}) => {
    
    return (
        <Grid item xs={12} sm={12} md={type === 'Debt Summary' ? 12 : 6} lg={type === 'Debt Summary' ? 12 : 6} >
            <SummaryHeading 
                name={type[0].toUpperCase()+type.slice(1)}
                icon={icon}
                link={link}
            />
                    {
                        type === 'Debt Summary' ? 
                            <Box>
                                {summaryTable}
                            </Box>
                        : 
                        length ?
                        <Tooltip 
                            title={tooltipMessage}
                            placement='top'
                            enterNextDelay={100}
                            enterTouchDelay={300}
                            leaveTouchDelay={500}
                        >
                            <Box>
                                {summaryTable}
                            </Box>
                        </Tooltip>
                        :
                        <Typography ml={1}>
                            {`No ${type}`}
                        </Typography>
                    }
        </Grid>
    )
}

export default Summary