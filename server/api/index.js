const router = require('express').Router()

router.use('/users', require('./users'))
router.use('/usertrips', require('./userTrip'))
router.use('/trips', require('./trips'))
router.use('/messages', require('./messages'))
router.use('/friends', require('./friends'))
router.use('/events', require('./events'))
router.use('/expenses', require('./expenses'))
router.use('/userFriends', require('./userFriends'))
router.use('/categories', require('./categories'))
router.use('/friendsPendingSent', require('./friendsPendingSent'))
router.use('/friendsPendingReceived', require('./friendsPendingReceived'))
router.use('/userDebts', require('./userDebts'))
router.use('/admin', require('./admin'))


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router