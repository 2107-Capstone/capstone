const db = require('../db')
const { ENUM } = require('sequelize')

const UserFriend = db.define('userFriend', {
    status: {
        type: ENUM('pending', 'accepted'),
        defaultValue: 'pending'
    }
})

module.exports = UserFriend