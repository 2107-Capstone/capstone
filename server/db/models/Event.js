const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, DECIMAL } = Sequelize

const axios = require('axios')

const Event = db.define('event', {
  name: {
    type: STRING,
    allowNull: false
  },
  location: {
    type: STRING,
    allowNull: false
  },
  description: {
      type: TEXT
  },
  startTime: {
      type: DATE,
      defaultValue: new Date(),
  },
  endTime: {
      type: DATE,
      defaultValue: new Date()
  },
  place_id: {
    type: STRING
  },
  lat: DECIMAL,
  lng: DECIMAL
})

module.exports = Event