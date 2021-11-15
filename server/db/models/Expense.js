const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, DECIMAL, DATE } = Sequelize

const Expense = db.define('expense', {
  name: {
    type: STRING,
  },
  amount: {
    type: DECIMAL(10, 2)
  },
  datePaid: {
    type: DATE
  }
})

module.exports = Expense