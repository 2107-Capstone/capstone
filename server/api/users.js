const router = require('express').Router()
const { models: { User, Trip, UserTrip, UserFriend } } = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username', 'lat', 'lng', 'time', 'email', 'phoneNumber', 'firstName', 'lastName'],
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
    if (req.headers.authorization === 'null') {
      console.log('YOU SHALL NOT PASS!')
      return res.send([])
    }
    try {
      const { lat, lng, time } = req.body;
      let user = await User.findByPk(req.params.userId)
      await user.update({...user, lat, lng, time});
      user = await User.findByPk(user.id, {
        include: [
          {
            model: UserTrip,
            include: [Trip]
          },
          {
            model: UserFriend,
            include: [{model: User, as: 'friend'}]
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