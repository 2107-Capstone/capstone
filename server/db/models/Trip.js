const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, BOOLEAN, DECIMAL } = Sequelize

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
  },
  isOpen: {
    type: BOOLEAN,
    defaultValue: true
  }, 
  lat: {
    type: DECIMAL
  },
  lng: {
    type: DECIMAL
  }
})

module.exports = Trip