const Sequelize = require('sequelize')
const db = require('../db')
const { TEXT, DATE } = Sequelize

const Message = db.define('message', {
  content: {
    type: TEXT,
    allowNull: false
  },
  dateSent: {
    type: DATE,
    allowNull: false
  }
})

module.exports = Message