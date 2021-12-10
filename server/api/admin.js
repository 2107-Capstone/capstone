const router = require('express').Router()

const isLoggedIn = require('../middleware/isLoggedIn')
const { models: { User, Trip, UserTrip, Message, Event, Expense, Category } } = require('../db')

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
      const trips = await Trip.findAll({
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
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
      const user = await User.findByToken(req.headers.authorization)
      if (user && user.username === 'Admin') {
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
      } else {
      res.send('No current user found via token')
      }
  }
  catch (error) {
      next(error)
  }
})

router.get('/adminmessages', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.send([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user && user.username === 'Admin') {
      const userTrips = await UserTrip.findAll({
        include: [
          {
            model: Trip
          }
        ]
      })
      
      const tripIds = userTrips.map(trip => trip.tripId);
    
      let messages = await Message.findAll({
        include: [
          {
            model: User,
            as: 'sentBy',
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName'],
          },
          {
            model: Trip
          }
        ]
      });
      
      messages = messages.filter(message => {
        return tripIds.includes(message.tripId)
      })
      res.send(messages)
    } else {
      //TODO Avoid an error message in our console if we can't find a user.
      res.send('No current user found via token.')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/adminevents', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user && user.username === 'Admin') {
      const trips = await UserTrip.findAll({
        include: [
          {
            model: Trip,
            include: [Event]
          }
        ]
      })

      const tripIds = trips.map(trip => trip.tripId)

      let events = await Event.findAll({
        include: [
          {
            model: Trip
          }
        ]
      })

      events = events.filter(event => {
        return tripIds.includes(event.tripId)
      })
      res.send(events)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/adminexpenses', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user && user.username === 'Admin') {
      const trips = await UserTrip.findAll({
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
          {
            model: User,
            as: 'paidBy',
            attributes: ['id', 'username']
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