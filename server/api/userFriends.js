const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { User, UserFriend }} = require('../db')
const { Op } = require("sequelize")
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const userFriends = await UserFriend.findAll({
        where: {
          [Op.or]: [{userId: user.id}, {friendId: user.id}]
        },
        include: [
          {
            model: User, as: 'friend', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          },
          {
            model: User, as: 'user', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          }
        ]
      })
      res.json(userFriends)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:userFriendId', isLoggedIn, async (req, res, next) => {
  try {
    const userFriend = await UserFriend.findByPk(req.params.userFriendId)
    res.json(userFriend)
  } catch (err) {
    next(err)
  }
})

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const userFriend = await UserFriend.create(req.body)
    res.json(userFriend)
  } catch (err) {
    next(err)
  }
})

router.put('/:userFriendId', isLoggedIn, async (req, res, next) => {
  const { status } = req.body
  try {
    const userFriend = await UserFriend.findByPk(req.params.userFriendId)
    await userFriend.update(req.body)
    res.json(userFriend)
  } catch (err) {
    next(err)
  }
})

router.delete('/:userFriendId', isLoggedIn, async (req, res, next) => {
  try {
    const userFriend = await UserFriend.findByPk(req.params.userFriendId)
    await userFriend.destroy()
    res.send(201)
  } catch (err) {
    next(err)
  }
})