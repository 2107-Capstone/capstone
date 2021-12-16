import React from 'react'

/////////////// MUI /////////////////
import { SpeedDialIcon, SpeedDial, SpeedDialAction } from '@mui/material';

/////////////// ICONS /////////////////
import { Event as EventIcon, PersonAdd as PersonAddIcon, Paid as PaidIcon } from '@mui/icons-material';

const TripSpeedDial = ({ handleCloseMenu, setOpen, setForm }) => {
    return (
        <div>
            <SpeedDial
                ariaLabel='Trip SpeedDial'
                direction='left'
                FabProps={{
                    variant: 'extended',
                    color: 'primary'
                }}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    enterTouchDelay={200}
                    leaveTouchDelay={900}
                    icon={<PersonAddIcon fontSize='large' color='secondary' sx={{ backgroundColor: 'white', borderRadius: '50%' }} />}
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
                    icon={<PaidIcon fontSize='large' color='secondary' sx={{ backgroundColor: 'white', borderRadius: '50%' }} />}
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
                    icon={<EventIcon fontSize='large' color='secondary' sx={{ backgroundColor: 'white', borderRadius: '50%' }} />}
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
