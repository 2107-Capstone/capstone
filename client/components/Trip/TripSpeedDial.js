import React from 'react'

/////////////// MUI /////////////////
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

/////////////// ICONS /////////////////
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaidIcon from '@mui/icons-material/Paid';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

const TripSpeedDial = ({handleCloseMenu, setOpen, setForm}) => {
    return (
        <div>
            <SpeedDial
                ariaLabel='Trip SpeedDial'
                direction='left'
                FabProps={{variant: 'extended',
                color: 'primary'}}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    enterTouchDelay={200}
                    leaveTouchDelay={900}
                    icon={<PersonAddIcon fontSize='large' color='secondary'/>}
                    tooltipTitle='Invite Friend'
                    // tooltipOpen
                    onClick={() => {
                        handleCloseMenu();
                        setOpen(true);
                        setForm('invitefriend')
                    }}
                />
                <SpeedDialAction
                    enterTouchDelay={200}
                    leaveTouchDelay={900}
                    icon={<PaidIcon fontSize='large' color='secondary'/>}
                    tooltipTitle='Add Expense'
                    // tooltipOpen
                    // tooltipPlacement='right'
                    onClick={() => {
                        handleCloseMenu();
                        setOpen(true);
                        setForm('expense')
                    }}
                />
                <SpeedDialAction
                    enterTouchDelay={200}
                    leaveTouchDelay={900}
                    icon={<EventIcon fontSize='large' color='secondary'/>}
                    tooltipTitle='Add Event'
                    TooltipClasses={{
                        enterTouchDelay: 300
                    }}
                    // tooltipOpen
                    onClick={() => {
                        handleCloseMenu();
                        setOpen(true);
                        setForm('event')
                    }}
                />
            </SpeedDial>
        </div>
    )
}
export default TripSpeedDial;
