const router = require('express').Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { UserTrip } } = require('../db')

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user
        const usertrips = await UserTrip.findAll({
            where: {
                userId: user.id
            }, 
        })
    }
    catch (error) {

    }
})




module.exports = router