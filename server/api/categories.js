const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { Category, User } } = require('../db')
module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user
    const categories = await Category.findAll();
    res.send(categories)
  }
  catch (err) {
    next(err)
  }
})


