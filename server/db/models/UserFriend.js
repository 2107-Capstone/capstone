const Sequelize = require('sequelize')
const db = require('../db')
const { ENUM } = Sequelize

const UserFriend= db.define('userFriend', {
    status: {
        type: ENUM('pending', 'accepted'),
        defaultValue: 'pending'
    }
})

module.exports = UserFriend