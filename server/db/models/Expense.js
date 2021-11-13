const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, DECIMAL } = Sequelize

const Expense = db.define('expense', {
  name: {
    type: STRING,
  },
  amount: {
    type: DECIMAL(10, 2)
  }
})

module.exports = Expense