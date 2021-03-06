const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { Trip, User, Message, UserTrip } } = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user
    const userTrips = await UserTrip.findAll({
      where: {
        userId: user.id
      },
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
  }
  catch (err) {
    next(err)
  }
})

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user
    let message = await Message.create(req.body);
    message = await Message.findByPk(message.id, {
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
    })
    res.send(message)
  }
  catch (err) {
    next(err)
  }
})

