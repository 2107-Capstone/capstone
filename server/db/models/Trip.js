
const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, BOOLEAN, INTEGER, DECIMAL } = Sequelize

const Trip = db.define('trip', {
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
  imageUrl: {
    type: TEXT
  },
  startTime: {
    type: DATE,
    allowNull: false
  },
  endTime: {
    type: DATE,
    allowNull: false
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
  },
  creatorId: {
    type: INTEGER,
  },
  creatorName: {
    type: STRING
  }
})

module.exports = Trip