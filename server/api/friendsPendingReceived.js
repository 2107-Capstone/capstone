const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { User, UserFriend }} = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const receiveds = await UserFriend.findAll({
        where: {
          friendId: user.id,
          status: 'pending'
        },
        include: [
          {
            model: User, as: 'user'
          }
        ]
      })
      res.json(receiveds)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:receivedId', isLoggedIn, async (req, res, next) => {
  try{  
    const received = await UserFriend.findOne({
      where: {
        id: req.params.receivedId,
        status: 'pending'
      },
      include: [
        {
          mode: User, as: 'user'
        }
      ]
    })
    res.json(received)
  } catch (err) {
    next(err)
  }
})

