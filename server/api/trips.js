const router = require('express').Router()
const { models: { User, Trip, UserTrip, Message }} = require('../db')

module.exports = router

router.get('/', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    //should be able to simply this given now there is a store for trips
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const trips = await UserTrip.findAll({
        where: {
          userId: user.id
        },
        include: [
          {
            model: Trip,
            include: [
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
                  attributes: ['id', 'username']
                }
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

router.get('/:tripId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.tripId
      }
    })
    res.json(trip)
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
    let trip = await Trip.create(req.body)
    trip = await Trip.findByPk(trip.id)
    res.json(trip)
  } catch (err) {
    next(err)
  }
})

router.put('/:tripId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const { name, location, startTime, endTime, isOpen } = req.body
    let trip = await Trip.findByPk(req.params.tripId)
    await trip.update({...trip, name, location, startTime, endTime, isOpen})
    trip = await Trip.findByPk(trip.id)
    res.json(trip)
  } catch (err) {
    next(err)
  }
})

router.delete('/:tripId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const trip = await Trip.findByPk(req.params.tripId)
    await trip.destroy()
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})