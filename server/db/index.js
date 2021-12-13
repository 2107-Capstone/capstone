//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Category = require('./models/Category')
const Event = require('./models/Event')
const Expense = require('./models/Expense')
const Message = require('./models/Message')
const Trip = require('./models/Trip')
const UserTrip = require('./models/UserTrip')
const UserFriend = require('./models/UserFriend')
const UserDebt = require('./models/UserDebt')

//associations

UserFriend.belongsTo(User, { as: 'friend' })
UserFriend.belongsTo(User, { as: 'user' })
User.hasMany(UserFriend, { foreignKey: 'friendId' })
User.hasMany(UserFriend, { foreignKey: 'userId' })

UserTrip.belongsTo(User)
User.hasMany(UserTrip)
UserTrip.belongsTo(Trip)
Trip.hasMany(UserTrip)

Trip.belongsTo(User)
User.hasMany(Trip)

Event.belongsTo(Trip)
Trip.hasMany(Event)

Expense.belongsTo(Trip)
Trip.hasMany(Expense)

Expense.belongsTo(User, { as: 'paidBy' })
User.hasMany(Expense, { foreignKey: 'paidById' })

Expense.belongsTo(Category)
Category.hasMany(Expense)

Message.belongsTo(Trip)
Trip.hasMany(Message)

Message.belongsTo(User, { as: "sentBy" })
User.hasMany(Message, { foreignKey: "sentById" })

UserDebt.belongsTo(User, { as: 'payor'})
UserDebt.belongsTo(User, { as: 'payee'})
User.hasMany(UserDebt)
UserDebt.belongsTo(Trip)
Trip.hasMany(UserDebt)

module.exports = {
  db,
  models: {
    User,
    Category,
    Event,
    Expense,
    Message,
    Trip,
    UserTrip,
    UserFriend,
    UserDebt
  },
}