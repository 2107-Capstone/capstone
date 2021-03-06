const db = require('../db')
const { STRING, ENUM } = require('sequelize')

const UserTrip = db.define('userTrip', {
    tripInvite: {
        type: ENUM('pending', 'accepted'),
        defaultValue: 'pending'
    },
    sentBy: {
        type: STRING
    }
})

module.exports = UserTrip