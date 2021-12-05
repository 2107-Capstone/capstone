const router = require('express').Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { UserTrip, Trip } } = require('../db')

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user
        const usertrips = await UserTrip.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: Trip
                }
            ]
        })
        res.json(usertrips)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router