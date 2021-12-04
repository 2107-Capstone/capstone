const router = require('express').Router()

const isLoggedIn = require('../middleware/isLoggedIn')
const { models: { User, Trip, UserTrip, Message, Event }} = require('../db')

module.exports = router

router.get('/', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
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
                  attributes: ['id', 'username', 'lat', 'lng', 'time']
                }
              },
              {
                model: Event
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
  if (req.headers.authorization === 'null') {
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

router.post('/', isLoggedIn, async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = req.user
    const tripToAdd = req.body;
    const trip = await Trip.create(tripToAdd)

    const adduserTrip = await UserTrip.create({ userId: user.id, tripId: trip.id })

    const userTrip = await UserTrip.findByPk(adduserTrip.id, {
      include: [
        {
          model: Trip,
          include: [{
            model: UserTrip,
            include: {
              model: User,
              attributes: ['id', 'username']
            }
          }]
        }
      ]
    })

    res.json(userTrip)
  } catch (err) {
    next(err)
  }
})

//this is for closing a trip only at the moment
router.put('/:tripId', async (req, res, next) => {
  console.log(req.params.tripId)
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    
    // const { name, location, startTime, endTime, isOpen } = req.body
    const userTrip = await UserTrip.findByPk(req.params.tripId)
    let trip = await Trip.findByPk(userTrip.tripId);
    await trip.update({ ...trip, isOpen: false })
    trip = await UserTrip.findByPk(userTrip.id, {
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
                attributes: ['id', 'username', 'lat', 'lng', 'time']
              }
            },
            {
              model: Event
            }
          ]
        }
      ]
    })

    res.json(trip)
  } catch (err) {
    next(err)
  }
})

router.delete('/:tripId', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
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