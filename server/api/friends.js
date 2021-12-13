const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { User, UserFriend } } = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const friends = await UserFriend.findAll({
        where: {
          userId: user.id,
          status: 'accepted'
        },
        include: [
          {
            model: User, as: 'friend', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          }
        ]
      })
      res.json(friends)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:friendId', isLoggedIn, async (req, res, next) => {
  try {
    const friend = await User.findOne({
      where: {
        id: req.params.friendId,
        status: 'accepted'
      },
      include: [
        {
          mode: User, as: 'friend', attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
        }
      ]
    })
    res.json(friend)
  } catch (err) {
    next(err)
  }
})

