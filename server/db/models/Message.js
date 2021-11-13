const Sequelize = require('sequelize')
const db = require('../db')
const { TEXT } = Sequelize

const Message = db.define('message', {
  content: {
    type: TEXT,
    allowNull: false
  }
})

module.exports = Message