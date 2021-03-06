const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { User, UserFriend } } = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user
    const sents = await UserFriend.findAll({
      where: {
        userId: user.id,
        status: 'pending'
      },
      include: [
        {
          model: User, as: 'friend'
        }
      ]
    })
    res.json(sents)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:sentId', isLoggedIn, async (req, res, next) => {
  try {
    const sent = await UserFriend.findOne({
      where: {
        userId: req.params.sentId,
        status: 'pending'
      },
      include: [
        {
          mode: User, as: 'friend'
        }
      ]
    })
    res.json(sent)
  } catch (err) {
    next(err)
  }
})

