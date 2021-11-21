const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/trips', require('./trips'))
router.use('/messages', require('./messages'))
router.use('/friends', require('./friends'))
router.use('/events', require('./events'))
router.use('/expenses', require('./expenses'))
router.use('/userFriends', require('./userFriends'))
router.use('/categories', require('./categories'))
router.use('/friendsPending', require('./friendsPending'))



router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})