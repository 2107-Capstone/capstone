const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, DECIMAL } = Sequelize

const Event = db.define('event', {
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
  place_id: {
    type: STRING
  },
  lat: DECIMAL,
  lng: DECIMAL
})

module.exports = Event