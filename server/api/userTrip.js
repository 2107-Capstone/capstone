const router = require('express').Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { UserTrip, Trip, User } } = require('../db')

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user
        const usertrips = await UserTrip.findAll({
            include: [
                {
                    model: Trip,
                },
                {
                    model: User,
                    attributes: ['id', 'username', 'lat', 'lng', 'time']
                }
            ]
        })
        res.json(usertrips)
    }
    catch (error) {
        next(error)
    }
})

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user
        const { invite } = req.body

        const invited = await UserTrip.create(invite)
        const invitedFriend = await UserTrip.findByPk(invited.id,
            {
                include: [
                    {
                        model: Trip,
                    },
                    {
                        model: User,
                        attributes: ['id', 'username', 'lat', 'lng', 'time']
                    }
                ]

            })
        res.json(invitedFriend)
    }
    catch (error) {
        next(error)
    }
})

router.put('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user
        const { invite } = req.body

        const inviteToUpdate = await UserTrip.findByPk(invite.id)
        await inviteToUpdate.update(invite);

        const acceptedinvite = await UserTrip.findByPk(invite.id,
            {
                include: [
                    {
                        model: Trip,
                    },
                    {
                        model: User,
                        attributes: ['id', 'username', 'lat', 'lng', 'time']
                    }
                ]

            })
        res.json(acceptedinvite)
    }
    catch (error) {
        next(error)
    }
})

router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user
        const { id } = req.params

        const inviteToDelete = await UserTrip.findByPk(id)
        await inviteToDelete.destroy()
        res.json(inviteToDelete)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router