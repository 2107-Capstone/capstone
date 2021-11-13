const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE } = Sequelize

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

module.exports = Trip