
const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, BOOLEAN, INTEGER, DECIMAL, UUID, UUIDV4 } = Sequelize

const Trip = db.define('trip', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true
  },
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
  }
})

module.exports = Trip