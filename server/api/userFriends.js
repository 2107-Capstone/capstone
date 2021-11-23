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
      const userFriends = await UserFriend.findAll({
        where: {
          userId: user.id
        }
      })
      res.json(userFriends)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:userFriendId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const userFriend = await UserFriend.findByPk(req.params.userFriendId)
    res.json(userFriend)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const userFriend = await UserFriend.create(req.body)
    res.json(userFriend)
  } catch (err) {
    next(err)
  }
})

router.delete('/:userFriendId', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const userFriend = await UserFriend.findByPk(req.params.userFriendId)
    await userFriend.destroy()
    res.send(201)
  } catch (err) {
    next(err)
  }
})