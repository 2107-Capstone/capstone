'use strict'

const { db, models: { User, Category, Event, Expense, Message, Trip, UserTrip, UserFriend } } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'Andy', password: '123', firstName: 'Andy', lastName: 'Gao', email: 'andy@123.com', phoneNumber: '1234567890', lat: 40.699251, lng: -73.953755, time: new Date() }),
    User.create({ username: 'Corinne', password: '123', firstName: 'Corinne', lastName: 'Tinacci', email: 'corinne@123.com', phoneNumber: '2345678901', lat: 40.717989, lng: -73.951693, time: new Date()   }),
    User.create({ username: 'Jonathan', password: '123', firstName: 'Jonathan', lastName: 'Martinez', email: 'jonathan@123.com', phoneNumber: '3456789012', lat: 40.717989, lng: -73.951693, time: new Date()  }),
    User.create({ username: 'Stanley', password: '123', firstName: 'Stanley', lastName: 'Lim', email: 'stanley@123.com', phoneNumber: '4567890123', lat: 40.717989, lng: -73.951693, time: new Date()   }),
    User.create({ username: 'Jason', password: '123', firstName: 'Jason', lastName: 'Williams', email: 'jason@123.com', phoneNumber: '5678901234', lat: 40.717989, lng: -73.951693, time: new Date()   }),
    User.create({ username: 'Prof', password: '123', firstName: 'Eric', lastName: 'Katz', email: 'eric@123.com', phoneNumber: '6789012345', lat: 40.717989, lng: -73.951693, time: new Date()    }),
  ])
  
  const [andy, corinne, jonathan, stanley, jason] = users.map(user => user)

  const trips = await Promise.all([
    Trip.create({ name: 'Trip to NYC', location: 'New York New York', description: 'A group trip to NYC!', startTime: '2021-11-11 12:00:00', endTime: '2021-11-18 23:59:59', isOpen: true, lat: 40.712776, lng :-74.005974 }),
    Trip.create({ name: 'Trip to Charlotte', location: 'Charlotte North Carolina', description: 'A group trip to Charlotte!', startTime: '2021-11-01 12:00:00', endTime: '2021-11-03 23:59:59', isOpen: false, lat: 35.227085, lng:  -80.843124 }),
    Trip.create({ name: 'Trip to Miami', location: 'Miami Florida', description: 'A group trip to Miami!', startTime: '2021-11-02 12:00:00', endTime: '2021-11-04 23:59:59', isOpen: false , lat: 25.761681, lng: -80.191788 }),
    Trip.create({ name: 'Trip to Paris', location: 'Paris France', description: 'A group trip to Paris!', startTime: '2021-12-11 12:00:00', endTime: '2021-12-18 23:59:59', isOpen: true, lat: 48.87531999859082, lng: 2.3302103060471153  }),
    Trip.create({ name: 'Friday night!', location: 'New York New York', description: 'Weekend hangout with the gang in the new year', startTime: '2022-01-07 20:00:00', endTime: '2021-01-08 05:00:00', isOpen: true, lat: 40.712776, lng :-74.005974 }),
    Trip.create({ name: 'NYE', location: 'New York New York', description: 'New Years Eve', startTime: '2021-12-31 20:00:00', endTime: '2022-01-01 03:00:00', isOpen: true, lat: 40.712776, lng :-74.005974 })
  ])
  
  const [nyc, charlotte, miami, paris, friday, nye] = trips.map(trip => trip)
  
  const categories = await Promise.all([
    Category.create({ name: 'Food and Drink' }),
    Category.create({ name: 'Entertainment' }),
    Category.create({ name: 'Transportation' }),
    Category.create({ name: 'Other' }),
  ])

  const [food_and_drink, entertainment, transportation, other] = categories.map(category => category)

  const events = await Promise.all([
    Event.create({ name: 'Movie', location: 'AMC Lincoln Square 13', description: 'Eternals', startTime: '2021-11-12 21:15:00', endTime: '2021-11-12 23:15:00', tripId: nyc.id, place_id: 'ChIJtcljhoZYwokRQZjDXiCA304', lat: 40.7751676, lng: -73.9819053 }),
    Event.create({ name: 'Dinner', location: 'Lilia', description: "don't forget to bring ID", startTime: '2021-11-13 20:00:00', endTime: '2021-11-13 22:00:00', tripId: nyc.id, place_id: 'ChIJJXCD6ltZwokRJ_cwjKQH63c', lat: 40.7175365, lng: -73.9524225 }),
    Event.create({ name: 'Museum', location: 'The Whitney Museum', description: '', startTime: '2021-11-13 10:15:00', endTime: '2021-11-13 12:15:00', tripId: nyc.id, place_id: 'ChIJN3MJ6pRYwokRiXg91flSP8Y', lat: 40.7395877, lng: -74.0088629 }),
    Event.create({ name: 'Hiking', location: 'Rocky Face Mountain', description: 'Group hiking', startTime: '2021-11-02 08:00:00', endTime: '2021-11-02 10:00:00', tripId: charlotte.id, place_id: 'ChIJdenvAr6bWYgRLX-EhoXIm4s', lat: 35.4653854, lng: -82.7992976 }),
    Event.create({ name: 'Party', location: "Infused Bar", description: '', startTime: '2021-11-02 20:00:00', endTime: '2021-11-02 23:00:00', tripId: charlotte.id, place_id: 'ChIJ_4Hm7SGgVogRNoZBXcKQn74', lat: 35.223096, lng: -80.8332363 }),
    Event.create({ name: 'Museum', location: 'Perez Art Museum Miami', description: 'Museum visit', startTime: '2021-11-03 08:00:00', endTime: '2021-11-03 10:00:00', tripId: miami.id, place_id: 'ChIJAUUpLJq22YgRAU604E8-tsM', lat: 25.7859307, lng: -80.1861912 }),
    Event.create({ name: 'Party', location: 'Mama Tried', description: 'cocktails and pool', startTime: '2021-11-04 20:00:00', endTime: '2021-11-05 03:00:00', tripId: miami.id, place_id: 'ChIJL7nwMRi32YgRPgB_p4PMTXk', lat: 25.7753682, lng: -80.1901163 }),
    Event.create({ name: 'Dinner', location: 'Comice', description: 'Dinner at Comice', startTime: '2021-12-12 20:00:00', endTime: '2021-12-12 22:59:59', tripId: paris.id, place_id: 'ChIJAc56Jah65kcRPUvIVLIaIjI', lat: 48.8494621, lng: 2.2760438 }),
    Event.create({ name: 'Food', location: 'Tamara', description: '', startTime: '2021-12-13 20:00:00', endTime: '2021-12-13 22:59:59', tripId: paris.id, place_id: 'ChIJlWVr9v9v5kcR2ecnPPpaWF8', lat: 48.8642796, lng: 2.336053 }),
    Event.create({ name: 'Dinner', location: 'Francie', description: "start the evening with dinner", startTime: '2022-01-07 20:00:00', endTime: '2022-01-07 22:30:00', tripId: friday.id, place_id: 'ChIJ35V_tZlbwokRzolpCln-mG4', lat: 40.710268, lng: -73.9639045 }),
    Event.create({ name: 'Drinks', location: 'Pokito', description: 'cocktails', startTime: '2022-01-07 23:00:00', endTime: '2022-01-08 01:00:00', tripId: friday.id, place_id: 'ChIJ3xcwmt9bwokRegnPhKtAL7U', lat: 40.71161300000001, lng: -73.9618029 }),
    Event.create({ name: 'Dancing', location: 'Moodring', description: 'cool dj and dancing yay', startTime: '2022-01-08 01:30:00', endTime: '2022-01-08 04:00:00', tripId: friday.id, place_id: 'ChIJp5MjfgVcwokREwMdmFvtrQ8', lat: 40.6978453, lng: -73.92699999999999 }),
  ])

  const expenses = await Promise.all([
    Expense.create({ name: 'Movie tickets', amount: 60, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id, datePaid: '2021-11-12' }),
    Expense.create({ name: 'dinner', amount: 200, tripId: nyc.id, paidById: corinne.id, categoryId: food_and_drink.id, datePaid: '2021-11-13' }),
    Expense.create({ name: 'whitney', amount: 80, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id, datePaid: '2021-11-13' }),
    Expense.create({ name: 'Uber to Rocky Face Mountain', amount: 35, tripId: charlotte.id, paidById: jonathan.id, categoryId: transportation.id, datePaid: '2021-11-02' }),
    Expense.create({ name: 'drinks', amount: 150, tripId: charlotte.id, paidById: andy.id, categoryId: food_and_drink.id, datePaid: '2021-11-03' }),
    Expense.create({ name: 'Museum tickets', amount: 80, tripId: miami.id, paidById: corinne.id, categoryId: entertainment.id, datePaid: '2021-11-04' }),
    Expense.create({ name: 'car', amount: 30, tripId: miami.id, paidById: andy.id, categoryId: transportation.id, datePaid: '2021-11-04' }),
    Expense.create({ name: 'museum gift shop', amount: 65, tripId: miami.id, paidById: jonathan.id, categoryId: other.id, datePaid: '2021-11-05' }),
    Expense.create({ name: 'Dinner at Comice', amount: 150, tripId: paris.id, paidById: corinne.id, categoryId: food_and_drink.id, datePaid: '2021-12-13' }),
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
    UserTrip.create({ userId: jason.id, tripId: paris.id }),
    UserTrip.create({ userId: jason.id, tripId: friday.id }),
    UserTrip.create({ userId: jonathan.id, tripId: friday.id }),
    UserTrip.create({ userId: corinne.id, tripId: friday.id }),
    UserTrip.create({ userId: andy.id, tripId: friday.id }),
    UserTrip.create({ userId: stanley.id, tripId: friday.id }),
    UserTrip.create({ userId: stanley.id, tripId: nye.id }),
    UserTrip.create({ userId: andy.id, tripId: nye.id }),
  ])

  const userFriends = await Promise.all([
    UserFriend.create({ userId: andy.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: andy.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: andy.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: andy.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: andy.id, status: 'accepted' }),
  ])

  const messages = await Promise.all([
    Message.create({ content: "Hi, how's it going?", tripId: nyc.id, sentById: andy.id, dateSent: '2021-11-12T05:40:34.000Z' }),
    Message.create({ content: "Great, see you soon!", tripId: nyc.id, sentById: corinne.id, dateSent: '2021-11-12T05:45:34.000Z' }),
    Message.create({ content: "Where are we going to?", tripId: charlotte.id, sentById: jonathan.id, dateSent: '2021-09-23T12:40:34.000Z' }),
    Message.create({ content: "The coolest place in Charlotte!", tripId: charlotte.id, sentById: andy.id, dateSent: '2021-09-23T12:43:34.000Z' }),
    Message.create({ content: "Are you at the airbnb yet?", tripId: miami.id, sentById: jonathan.id, dateSent: '2021-11-12T10:40:34.000Z' }),
    Message.create({ content: "Five mins away", tripId: miami.id, sentById: andy.id, dateSent: '2021-11-12T10:41:34.000Z' }),
    Message.create({ content: "Still at airport!", tripId: miami.id, sentById: corinne.id, dateSent: '2021-11-12T10:43:34.000Z' }),
    Message.create({ content: "Looking forward to it!", tripId: paris.id, sentById: corinne.id, dateSent: '2021-11-08T05:40:34.000Z' }),
    Message.create({ content: "Me too!", tripId: paris.id, sentById: jonathan.id, dateSent: '2021-11-08T09:13:34.000Z' }),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      andy,
      corinne,
      jonathan,
      jason,
      stanley
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
      paris,
      friday,
      nye
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