const router = require('express').Router()
const { models: { User, Trip, UserTrip, UserFriend } } = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName'],
      include: [
        {
          model: UserTrip,
          include: [Trip]
        },
        {
          model: UserFriend,
          include: [{ model: User, as: 'friend' }]
        }
      ]
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId
      },
      include: [
        {
          model: UserTrip,
          include: [Trip]
        },
        {
          model: UserFriend,
          include: [{ model: User, as: 'friend' }]
        }
      ]
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    res.send(await user.update(req.body))
  } catch (err) {
    next(err)
  }
})