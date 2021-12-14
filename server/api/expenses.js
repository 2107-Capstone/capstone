const router = require('express').Router()
const { models: { User, Trip, UserTrip, Expense, Category } } = require('../db')
const isLoggedIn = require('../middleware/isLoggedIn');
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
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
            attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Category
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

router.get('/:expenseId', isLoggedIn, async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.expenseId
      },
      include: [
        {
          mode: Trip
        }
      ]
    })
    res.json(expense)
  } catch (err) {
    next(err)
  }
})

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    let expense = await Expense.create(req.body)
    expense = await Expense.findByPk(expense.id, {
      include: [
        {
          model: Trip
        },
        //included this to have access to name of person who paid
        {
          model: User,
          as: 'paidBy',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Category
        }
      ]
    })
    res.json(expense)
  } catch (err) {
    next(err)
  }
})


router.put('/:expenseId', isLoggedIn, async (req, res, next) => {
  try {
    const { name, amount, datePaid, tripId, paidById, categoryId } = req.body
    let expense = await Expense.findByPk(req.params.expenseId)
    await expense.update({ ...expense, name, amount, datePaid, tripId, paidById, categoryId })
    expense = await Expense.findByPk(expense.id, {
      include: {
        model: Trip
      }
    })
    res.json(expense)
  } catch (err) {
    next(err)
  }
})

router.delete('/:expenseId', isLoggedIn, async (req, res, next) => {
  try {
    const expense = await Expense.findByPk(req.params.expenseId)
    await expense.destroy()
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})