import React from 'react'
import { useSelector } from 'react-redux'
import { format, formatISO, parseISO, isAfter } from "date-fns";

export const Participants = ({ trip, auth }) => {
    //TODO: why does    trip = trip.trip    not allow refresh?

    if (!trip) return "...loading"
    return (
        <ol>
            {
                trip.trip.userTrips.map((user, idx) => {
                    return (
                        <li key={idx}
                            style={user.userId === auth.id ? styles.currentUser : null}
                        >
                            {user.user.username}
                        </li>
                    )
                })
            }
        </ol>
    )
}

export const Events = ({ tripId }) => {
    const events = useSelector(state => state.events.filter(event => event.tripId === tripId).sort((a, b) => a.startTime < b.startTime ? -1 : 1));
    if (tripId) {
        if (events.length === 0) return "No events"
    } else {
        if (events.length === 0) return "...loading"
    }
        return (
            <ol>
                {
                  events.map(event => (
                    <li key={event.id}>
                        ({format(parseISO(event.startTime), 'Pp')}): {event.name} at {event.location}
                        <br></br>
                        Details: {event.description}
                    </li>

                ))
            }
        </ol>
    )
}
export const Expenses = ({ tripId }) => {
    const expenses = useSelector(state => state.expenses.filter(expense => expense.tripId === tripId).sort((a, b) => a.datePaid < b.datePaid ? -1 : 1));
    if (tripId) {
        if (expenses.length === 0) return "No expenses"
    } else {
        if (expenses.length === 0) return "...loading"
    }
    return (
        <ol>
            {
                expenses.map((expense, idx) => (
                    <li key={idx}>
                        ({format(parseISO(expense.datePaid), 'P')}): {expense.name}: ${(+expense.amount).toFixed(2)}
                        <br></br>
                        Paid By: {expense.paidBy.username}
                    </li>
                ))
            }
        </ol>
    )
}





const styles = {
    currentUser: {
        fontWeight: 'bold',
    },
}