const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn')
const { models: { User, Trip, UserTrip, Message, Event, Expense, UserDebt } } = require('../db')

module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    //should be able to simply this given now there is a store for trips
    const user = req.user
    const trips = await UserTrip.findAll({
      where: {
        userId: user.id
      },
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
            },
            {
              model: UserDebt,
              include: [
                {
                  model: User, as: 'payor', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
                },
                {
                  model: User, as: 'payee', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
                }
              ]
            }
          ]
        }
      ]
    })
    res.json(trips)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:tripId', isLoggedIn, async (req, res, next) => {
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
  try {
    const user = req.user
    const { description, endTime, imageUrl, lat, lng, location, name, startTime } = req.body;
    const trip = await Trip.create({ description, endTime, imageUrl, lat, lng, location, name, startTime, userId: user.id })

    const adduserTrip = await UserTrip.create({ userId: user.id, tripId: trip.id, tripInvite: "accepted" })

    const userTrip = await UserTrip.findByPk(adduserTrip.id, {
      include: [
        {
          model: Trip,
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'lat', 'lng', 'time', 'firstName', 'lastName', 'avatar']
            },
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

    res.json(userTrip)
  } catch (err) {
    next(err)
  }
})

//this is for closing a trip only at the moment
// router.put('/:tripId', async (req, res, next) => {
//   console.log(req.params.tripId)
//   if (req.headers.authorization === 'null') {
//     console.log('YOU SHALL NOT PASS!')
//     return res.json([])
//   }
//   try {

//     // const { name, location, startTime, endTime, isOpen } = req.body
//     const userTrip = await UserTrip.findByPk(req.params.tripId)
//     let trip = await Trip.findByPk(userTrip.tripId);
//     await trip.update({ ...trip, isOpen: false })
//     trip = await UserTrip.findByPk(userTrip.id, {
//       include: [
//         {
//           model: Trip,
//           include: [
//             {
//               model: User,
//               attributes: ['id', 'username', 'avatar', 'firstName', 'lastName']
//             },
//             {
//               model: Message,
//               include: {
//                 model: User,
//                 as: 'sentBy',
//                 attributes: ['id', 'username', 'avatar']
//               }
//             },
//             //included this to possibly simplify finding participants in a trip
//             {
//               model: UserTrip,
//               include: {
//                 model: User,
//                 attributes: ['id', 'username', 'lat', 'lng', 'time']
//               }
//             },
//             {
//               model: Event
//             },
//             {
//               model: Expense
//             }
//           ]
//         }
//       ]
//     })

//     res.json(trip)
//   } catch (err) {
//     next(err)
//   }
// })
router.put('/:tripId', isLoggedIn, async (req, res, next) => {
  try {
    let userTrip = await UserTrip.findByPk(req.params.tripId)
    const trip = await Trip.findByPk(userTrip.tripId);

    if (req.body.userTripId) {
      const { id, name, location, startTime, endTime, description } = req.body
      await trip.update({ ...trip, id, name, location, startTime, endTime, description })
    } else {
      await trip.update({ ...trip, isOpen: false })
    }

    userTrip = await UserTrip.findByPk(userTrip.id, {
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
                attributes: ['id', 'username', 'avatar']
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
            },
            {
              model: Expense
            }
          ]
        }
      ]
    })
    res.json(userTrip)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params
    const trip = await UserTrip.findByPk(id)
    await trip.destroy()
    res.status(201).send(trip)
  } catch (err) {
    next(err)
  }
})