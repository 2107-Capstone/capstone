const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { Category, User } } = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const categories = await Category.findAll();
      res.send(categories)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})


