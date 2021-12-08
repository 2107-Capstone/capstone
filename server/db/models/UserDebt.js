const db = require('../db')
const { ENUM, DECIMAL } = require('sequelize')

const UserDebt = db.define('userDebt', {
    amount: {
        type: DECIMAL(10,2)
    },
    status: {
        type: ENUM('pending', 'paid'),
        defaultValue: 'pending'
    }
})

module.exports = UserDebt