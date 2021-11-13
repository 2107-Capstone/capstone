const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, VIRTUAL } = Sequelize

const Trip = db.define('trip', {
  name: {
    type: STRING,
  },
  location: {
    type: STRING,
  },
  description: {
      type: TEXT
  },
  startTime: {
      type: DATE
  },
  endTime: {
      type: DATE
  }
})

// Trip.prototype.findParticipants = async function(){
//   return await db.models.userTrip.findAll({
//     where: {
//       tripId: this.id
//     },
//     include: [db.models.user]
//   })
// }
// Trip.prototype.findMessages = async function(){
//   return await db.models.message.findAll({
//     where: {
//       tripId: this.id
//     },
//     include: [db.models.message],
//     include: [db.models.user]
//   })
// }
module.exports = Trip