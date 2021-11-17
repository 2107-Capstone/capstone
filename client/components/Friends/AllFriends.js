import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../../store";

const AllFriends = () => {
    const dispatch = useDispatch();
    useEffect(async () => {
        await dispatch(getFriends())
    }, [])

    const { friends } = useSelector(state => state)
    const user = useSelector(state => state.auth)

    if (!friends) {
        return (
            <h1>loading</h1>
        )
    }
    return (
        <div>
            <h3>{user.username}'s Friends</h3>
            <ul key={Math.random().toString(16)}>
                {
                    friends.length === 0 ? <h5>No Friends :(</h5> :
                        friends.map(friend => (
                            <li key={friend.id + Math.random().toString(16)}>
                                {friend.friend.username}
                            </li>
                        ))
                }
            </ul>
        </div>
    )
}

export default AllFriends
