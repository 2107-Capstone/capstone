import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getFriends, getTrips } from "../../store";

const Dashboard = () => {
    const user = useSelector(state => state.auth)
    const { friends, trips } = useSelector(state => state)

    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getFriends())
        await dispatch(getTrips())
    }, [])


    if (!friends || !trips) {
        return (
            <h1>loading</h1>
        )
    }

    return (
        <div>
            <h3>Welcome, {user.username}</h3>
            <h4>Trips: {trips.length}</h4>
            <h4>Friends: {friends.length}</h4>
        </div>
    )
}

export default Dashboard
