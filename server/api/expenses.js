const router = require('express').Router()
const { models: { User, Trip, UserTrip, Expense }} = require('../db')

module.exports = router

router.get('/', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const trips = await UserTrip.findAll({
        where: {
          userId: user.id
        },
        include: [
          {
            model: Trip,
            include: [Expense]
          }
        ]
      })
      
      const tripIds = trips.map(trip => trip.tripId)

      let expenses = await Expense.findAll({
        include: [
          {
            model: Trip
          },
//included this to have access to name of person who paid
          {
            model: User,
            as: 'paidBy',
            attributes: ['id', 'username']
          }
        ]
      })
      expenses = expenses.filter(expense => {
        return tripIds.includes(expense.tripId)
      })

      res.json(expenses)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

