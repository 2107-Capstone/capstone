import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { getTrips } from "../../store";

const AllTrips = () => {
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getTrips())
    }, [])

    const { trips } = useSelector(state => state)
    const user = useSelector(state => state.auth)

    if (!trips) {
        return (
            <h1>loading</h1>
        )
    }
    return (
        <div>
            <h3>Trips for {user.username}</h3>
            <ul>
                {
                    trips.length === 0 ? <h5>No Trips :(</h5> :
                        trips.map(trip => (
                            <div key={trip.id + Math.random().toString(16)}>
                                <li>
                                    <Link to={`/trip/${trip.tripId}`}>{trip.trip.name}</Link>
                                </li>
                            </div>
                        ))
                }
            </ul>
        </div >
    )
}

export default AllTrips