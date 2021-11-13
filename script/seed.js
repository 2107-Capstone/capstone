'use strict'

const {db, models: {User, Category, Event, Expense, Message, Trip, UserTrip, UserFriend} } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'andy', password: '123', firstName: 'Andy', lastName: 'Gao', email: 'andy@123.com', phoneNumber: '1234567890' }),
    User.create({ username: 'corinne', password: '123', firstName: 'Corinne', lastName: 'Tinacci', email: 'corinne@123.com', phoneNumber: '2345678901'  }),
    User.create({ username: 'jonathan', password: '123', firstName: 'Jonathan', lastName: 'Martinez', email: 'jonathan@123.com', phoneNumber: '3456789012'  }),
  ])
  
  const [andy, corinne, jonathan] = users.map(user => user)
  
  const trips = await Promise.all([
    Trip.create({ name: 'Trip to NYC', location: 'New York', description: 'A group trip to NYC!', startTime: '2021-11-11 12:00:00', endTime: '2021-11-18 23:59:59' }),
    Trip.create({ name: 'Trip to Charlotte', location: 'Charlotte', description: 'A group trip to Charlotte!', startTime: '2021-11-01 12:00:00', endTime: '2021-11-03 23:59:59'  }),
    Trip.create({ name: 'Trip to Miami', location: 'Miami', description: 'A group trip to Miami!', startTime: '2021-11-02 12:00:00', endTime: '2021-11-04 23:59:59'  }),
    Trip.create({ name: 'Trip to Paris', location: 'Paris', description: 'A group trip to Paris!', startTime: '2021-12-11 12:00:00', endTime: '2021-12-18 23:59:59'  }),
  ])

  const [nyc, charlotte, miami, paris] = trips.map(trip => trip)
  
  const categories = await Promise.all([
    Category.create({ name: 'food and drink' }),
    Category.create({ name: 'entertainment' }),
    Category.create({ name: 'transportation' }),
    Category.create({ name: 'other' }),
  ])

  const [food_and_drink, entertainment, transportation, other] = categories.map(category => category)

  const events = await Promise.all([
    Event.create({ name: 'Movie', location: 'AMC Lincoln Square 13', description: 'Eternals', startTime: '2021-11-12 21:15:00', endTime: '2021-11-12 23:15:00', tripId: nyc.id }),
    Event.create({ name: 'Hiking', location: 'Rocky Face Mountain', description: 'Group hiking', startTime: '2021-11-02 08:00:00', endTime: '2021-11-02 10:00:00', tripId: charlotte.id }),
    Event.create({ name: 'Museum', location: 'Pérez Art Museum Miami', description: 'Museum visit', startTime: '2021-11-03 08:00:00', endTime: '2021-11-03 10:00:00', tripId: miami.id }),
    Event.create({ name: 'Dinner', location: 'Comice', description: 'Dinner at Comice', startTime: '2021-12-12 20:00:00', endTime: '2021-12-12 22:59:59', tripId: paris.id }),
  ])

  const expenses = await Promise.all([
    Expense.create({ name: 'Movie tickets', amount: 60, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id}),
    Expense.create({ name: 'Uber to Rocky Face Mountain', amount: 35, tripId: charlotte.id, paidById: jonathan.id, categoryId: transportation.id}),
    Expense.create({ name: 'Museum tickets', amount: 80, tripId: miami.id, paidById: corinne.id, categoryId: entertainment.id}),
    Expense.create({ name: 'Dinner at Comice', amount: 150, tripId: paris.id, paidById: corinne.id, categoryId: food_and_drink.id}),
  ])

  const userTrips = await Promise.all([
    UserTrip.create({ userId: andy.id, tripId: nyc.id }),
    UserTrip.create({ userId: andy.id, tripId: charlotte.id }),
    UserTrip.create({ userId: andy.id, tripId: miami.id }),
    UserTrip.create({ userId: corinne.id, tripId: nyc.id }),
    UserTrip.create({ userId: corinne.id, tripId: miami.id }),
    UserTrip.create({ userId: corinne.id, tripId: paris.id }),
    UserTrip.create({ userId: jonathan.id, tripId: charlotte.id }),
    UserTrip.create({ userId: jonathan.id, tripId: miami.id }),
    UserTrip.create({ userId: jonathan.id, tripId: paris.id }),
  ])

  const userFriends = await Promise.all([
    UserFriend.create({ userId: andy.id, friendId: corinne.id }),
    UserFriend.create({ userId: andy.id, friendId: jonathan.id }),
    UserFriend.create({ userId: corinne.id, friendId: andy.id }),
    UserFriend.create({ userId: corinne.id, friendId: jonathan.id }),
    UserFriend.create({ userId: jonathan.id, friendId: andy.id }),
    UserFriend.create({ userId: jonathan.id, friendId: corinne.id }),

  ])
  
  const messages = await Promise.all([
    Message.create({ content: "Hi, how's it going?", tripId: nyc.id, sentById: andy.id, dateSent: '2021-11-12T05:40:34.000Z'}),
    Message.create({ content: "Great, see you soon!", tripId: nyc.id, sentById: corinne.id, dateSent: '2021-11-12T05:45:34.000Z'}),
    Message.create({ content: "Where are we going to?", tripId: charlotte.id, sentById: jonathan.id, dateSent: '2021-09-23T12:40:34.000Z' }),
    Message.create({ content: "The coolest place in Charlotte!", tripId: charlotte.id, sentById: andy.id, dateSent: '2021-09-23T12:43:34.000Z' }),
    Message.create({ content: "Are you at the airbnb yet?", tripId: miami.id, sentById: jonathan.id, dateSent: '2021-11-12T10:40:34.000Z' }),
    Message.create({ content: "Five mins away", tripId: miami.id, sentById: andy.id, dateSent: '2021-11-12T10:41:34.000Z' }),
    Message.create({ content: "Still at airport!", tripId: miami.id, sentById: corinne.id, dateSent: '2021-11-12T10:43:34.000Z' }),
    Message.create({ content: "Looking forward to it!", tripId: paris.id, sentById: corinne.id, dateSent: '2021-11-08T05:40:34.000Z'}),
    Message.create({ content: "Me too!", tripId: paris.id, sentById: jonathan.id, dateSent: '2021-11-08T09:13:34.000Z'}),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      andy,
      corinne,
      jonathan
    },
    categories: {
      food_and_drink, 
      entertainment, 
      transportation, 
      other
    },
    events,
    expenses,
    messages,
    trips: {
      nyc,
      charlotte,
      miami,
      paris
    },
    userTrips,
    userFriends
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed