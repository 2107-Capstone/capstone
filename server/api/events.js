const router = require('express').Router()
const { models: { User, Trip, UserTrip, Event }} = require('../db')

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

      res.json(events)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:eventId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId
      },
      include: [
        {
          mode: Trip
        }
      ]
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    let event = await Event.create(req.body)
    event = await Event.findByPk(event.id, {
      include: [
        {
          model: Trip
        }
      ]
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

router.put('/:eventId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const { name, description, startTime, endTime, tripId } = req.body
    let event = await Event.findByPk(req.params.eventId)
    await event.update({...event, name, description, startTime, endTime, tripId})
    event = await Event.findByPk(event.id, {
      include: {
        model: Trip
      }
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

router.delete('/:eventId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const event = await Event.findByPk(req.params.eventId)
    await event.destroy()
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})