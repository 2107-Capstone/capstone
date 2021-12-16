import React from "react"
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const TripButton = ({id, name, icon}) => {
    
    return (
        <Button
            component={Link} to={`${id}/${name}`}
            startIcon={icon}
            size='medium'
            color='secondary'
            variant='contained'
        >
            {name.toUpperCase()}
        </Button>
    )
}

export default TripButton