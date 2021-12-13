const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { User, Trip, UserTrip, UserFriend } } = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar'],
      include: [
        {
          model: UserTrip,
          include: [Trip]
        },
        {
          model: UserFriend,
          include: [{ model: User, as: 'friend', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar'] }]
        }
      ]
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId
      },
      attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar'],
      include: [
        {
          model: UserTrip,
          include: [Trip]
        },
        {
          model: UserFriend,
          include: [{ model: User, as: 'friend', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar'] }]
        }
      ]
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId', isLoggedIn, async (req, res, next) => {
    try {
      const { lat, lng, time, username, firstName, lastName, email, phoneNumber, password, avatar } = req.body;
      let user = await User.findByPk(req.params.userId)
      await user.update({...user, lat, lng, time, username, firstName, lastName, email, phoneNumber, password, avatar });
      user = await User.findByPk(user.id, {
        attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar'],
        include: [
          {
            model: UserTrip,
            include: [Trip]
          },
          {
            model: UserFriend,
            include: [{model: User, as: 'friend', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']}]
          }
        ]
      })
      res.json(user)
    } catch (err) {
      next(err)
    }
  })
// router.put('/:userId', async(req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.userId)
//     res.send(await user.update(req.body))
//   } catch (err) {
//     next(err)
//   }
// })