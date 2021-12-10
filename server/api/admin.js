const router = require('express').Router()

const isLoggedIn = require('../middleware/isLoggedIn')
const { models: { User, Trip, UserTrip, Message, Event, Expense } } = require('../db')

module.exports = router

router.get('/admintrips', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    //should be able to simply this given now there is a store for trips
    const user = await User.findByToken(req.headers.authorization)
    if (user && user.username === 'Admin') {
      const trips = await UserTrip.findAll({
        include: [
          {
            model: Trip,
            include: [
              {
                model: User,
                attributes: ['id', 'username', 'avatar', 'firstName', 'lastName']
              },
              {
                model: Message,
                include: {
                  model: User,
                  as: 'sentBy',
                  attributes: ['id', 'username']
                }
              },
              //included this to possibly simplify finding participants in a trip
              {
                model: UserTrip,
                include: {
                  model: User,
                  attributes: ['id', 'username', 'lat', 'lng', 'time', 'firstName', 'lastName', 'avatar']
                }
              },
              {
                model: Event
              },
              {
                model: Expense
              }
            ]
          }
        ]
      })

      res.json(trips)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/admintrips/:admintripId', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.admintripId
      }
    })
    res.json(trip)
  } catch (err) {
    next(err)
  }
})

router.get('/adminusertrips', isLoggedIn, async (req, res, next) => {
  try {
      const user = req.user
      if (user && user.username === 'admin') {
        const usertrips = await UserTrip.findAll({
            include: [
                {
                    model: Trip,
                },
                {
                    model: User,
                    attributes: ['id', 'username', 'lat', 'lng', 'time']
                }
            ]
        })
        res.json(usertrips)
      }
  }
  catch (error) {
      next(error)
  }
})