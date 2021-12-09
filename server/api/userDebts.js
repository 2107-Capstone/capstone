const router = require('express').Router()
const { models: { User, UserDebt, Trip } } = require('../db')
const { Op } = require("sequelize")
module.exports = router

router.get('/', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const userDebts = await UserDebt.findAll({
        where: {
          [Op.or]: [{ payorId: user.id }, { payeeId: user.id }]
        },
        include: [
          {
            model: User, as: 'payor', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          },
          {
            model: User, as: 'payee', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Trip
          },
        ]
      })
      res.json(userDebts)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:userDebtId', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const userDebt = await UserDebt.findByPk(req.params.userDebtId)
    res.json(userDebt)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const { userDebt } = req.body
    const created = await UserDebt.create(userDebt)

    const debt = await UserDebt.findByPk(created.id,
      {
        include: [
          {
            model: User, as: 'payor', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          },
          {
            model: User, as: 'payee', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Trip
          },
        ]
      }
    )

    res.json(debt)
  } catch (err) {
    next(err)
  }
})

router.put('/:userDebtId', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }

  try {
    let userDebt = await UserDebt.findByPk(req.params.userDebtId)
    await userDebt.update({ ...userDebt, status: 'paid' })
    userDebt = await UserDebt.findByPk(userDebt.id, {
      include: [
        {
          model: User, as: 'payor', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User, as: 'payee', attributes: ['id', 'username', 'email', 'phoneNumber', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Trip
        },
      ]
    })
    res.json(userDebt)
  } catch (err) {
    next(err)
  }
})

// router.delete('/:userFriendId', async (req, res, next) => {
//   if(req.headers.authorization === 'null') {
//     console.log('YOU SHALL NOT PASS!')
//     return res.json([])
//   }
//   try {
//     const userFriend = await UserFriend.findByPk(req.params.userFriendId)
//     await userFriend.destroy()
//     res.send(201)
//   } catch (err) {
//     next(err)
//   }
// })