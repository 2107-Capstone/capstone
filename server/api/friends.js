const router = require('express').Router()
const { models: { User, UserFriend }} = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }

  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const friends = await User.findAll({
        where: {
          id: user.id
        },
        include: [
          {
            model: UserFriend,
            include: [{model: User, as: 'friend'}]
          }
        ]
      }).userFriends
      res.json(friends)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

