const router = require('express').Router()
const { models: { User, Trip, UserTrip, Message }} = require('../db')

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

/*router.get('/:id', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const trip = await Trip.findByPk(req.params.id)
      const participants = await trip.findParticipants();
      const messages = await trip.findMessages();
      trip.participants = participants;
      trip.messages = messages;
      res.send(trip)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})*/
