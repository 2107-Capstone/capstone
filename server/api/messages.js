const router = require('express').Router()
const { models: { Trip, User, Message, UserTrip }} = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.send([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
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
    } else {
      //TODO Avoid an error message in our console if we can't find a user.
      res.send('No current user found via token.')
    }
  } catch (err) {
    next(err)
  }
})
router.post('/', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.send([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
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
    } else {
      //TODO Avoid an error message in our console if we can't find a user.
      res.send('No current user found via token.')
    }
  } catch (err) {
    next(err)
  }
})

