'use strict'

const { db, models: { User, Category, Event, Expense, Message, Trip, UserTrip, UserFriend } } = require('../server/db')

/////// import image //////////////////
const airplane = '/images/airplane.png'
const avatar = 'data:image/png;base64,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';

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'Andy', password: '123', firstName: 'Andy', lastName: 'Gao', email: 'andy@123.com', phoneNumber: '1234567890', time: new Date() }),
    User.create({ username: 'Corinne', password: '123', firstName: 'Corinne', lastName: 'Tinacci', email: 'corinne@123.com', phoneNumber: '2345678901', time: new Date() }),
    User.create({ username: 'Jonathan', password: '123', firstName: 'Jonathan', lastName: 'Martinez', email: 'jonathan@123.com', phoneNumber: '3456789012', time: new Date() }),
    User.create({ username: 'Stanley', password: '123', firstName: 'Stanley', lastName: 'Lim', email: 'stanley@123.com', phoneNumber: '4567890123',  time: new Date() }),
    User.create({ username: 'Jason', password: '123', firstName: 'Jason', lastName: 'Williams', email: 'jason@123.com', phoneNumber: '5678901234',  time: new Date() }),
    User.create({ username: 'Prof', password: '123', firstName: 'Prof', lastName: 'Profman', email: 'prof@123.com', phoneNumber: '1239012349',  time: new Date() }),
    User.create({ username: 'Moe', password: '123', firstName: 'Moe', lastName: 'Moeman', email: 'moe@123.com', phoneNumber: '6789012341',  time: new Date() }),
    User.create({ username: 'Poe', password: '123', firstName: 'Poe', lastName: 'Poet', email: 'Poe@123.com', phoneNumber: '6789012342',  time: new Date() }),
    User.create({ username: 'Lucy', password: '123', firstName: 'Lucy', lastName: 'Luck', email: 'Lucy@123.com', phoneNumber: '6789012343',  time: new Date() }),
    User.create({ username: 'JJ', password: '123', firstName: 'JJ', lastName: 'Jay', email: 'jj@123.com', phoneNumber: '6789012340',  time: new Date() }),
    User.create({ username: 'Marge', password: '123', firstName: 'Marge', lastName: 'Bouvier', email: 'marge@123.com', phoneNumber: '6789012349',  time: new Date() }),
  ])

  const [andy, corinne, jonathan, stanley, jason, prof] = users.map(user => user)

  const trips = await Promise.all([
    Trip.create({ name: 'Trip to NYC', location: 'New York, NY', description: 'A group trip to NYC!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qW_5nGteBkgrTUQb2QxbtKdTuJd2HcCpZ9TRFSDsi1_iNFTzBRyz3pRY9cV0Lst6sHiF4tkAFDLNgIgKOeCKFIof7GebFJXJE=s1600-w4032', startTime: '2022-01-07 12:00:00', endTime: '2022-01-14 23:59:59', isOpen: true, lat: 40.712776, lng: -74.005974, creatorId: andy.id, creatorName: andy.username }),
    Trip.create({ name: 'Trip to Charlotte', location: 'Charlotte, NC', description: 'A group trip to Charlotte!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qFrlXaH_sLHU0REAkEOyptZnIJ3_Yddyeb8QSHQXR9wk2FsI6wsKDfSJOyjcw6-QpJ64O1LrJPRrxnMsiFIsNydfOMcMRFfhM=s1600-w1080', startTime: '2021-12-01 12:00:00', endTime: '2021-12-03 23:59:59', isOpen: true, lat: 35.227085, lng: -80.843124, creatorId: jonathan.id, creatorName: jonathan.username  }),
    Trip.create({ name: 'Trip to Miami', location: 'Miami, FL', description: 'A group trip to Miami!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qveJ4lsmw7U_l8zUnBWDBLMCImIIT2I9mCX1Gvbgys7XbgGtRl6GyB-l7rRccc-azR-UGA3Wc5EsU61QJKXxSwZGxV0eZkFVw=s1600-w2560', startTime: '2021-12-12 12:00:00', endTime: '2021-12-15 23:59:59', isOpen: true, lat: 25.761681, lng: -80.191788, creatorId: jonathan.id, creatorName: jonathan.username  }),
    Trip.create({ name: 'Trip to Paris', location: 'Paris, France', description: 'A group trip to Paris!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qAEVTGSbA79pzizPEYGJ0Cpwk637M1DP_nOw6-MVGLohKktj7dJY6E67Xz-PCCqSAWvyZy6e3wF3zF-H7v-MARpAx44w1AH38=s1600-w600', startTime: '2021-12-20 12:00:00', endTime: '2021-12-30 23:59:59', isOpen: true, lat: 48.87531999859082, lng: 2.3302103060471153, creatorId: jason.id, creatorName: jason.username }),
    Trip.create({ name: 'Friday night!', location: 'New York, NY', description: 'Weekend hangout with the gang in the new year', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qW_5nGteBkgrTUQb2QxbtKdTuJd2HcCpZ9TRFSDsi1_iNFTzBRyz3pRY9cV0Lst6sHiF4tkAFDLNgIgKOeCKFIof7GebFJXJE=s1600-w4032', startTime: '2022-01-07 20:00:00', endTime: '2022-01-08 05:00:00', isOpen: true, lat: 40.712776, lng: -74.005974, creatorId: corinne.id, creatorName: corinne.username }),
    Trip.create({ name: 'NYE', location: 'New York, New York', description: 'New Years Eve', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qW_5nGteBkgrTUQb2QxbtKdTuJd2HcCpZ9TRFSDsi1_iNFTzBRyz3pRY9cV0Lst6sHiF4tkAFDLNgIgKOeCKFIof7GebFJXJE=s1600-w4032', startTime: '2021-12-31 20:00:00', endTime: '2022-01-01 03:00:00', isOpen: true, lat: 40.712776, lng: -74.005974, creatorId: andy.id, creatorName: andy.username })
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
    Event.create({ name: 'Movie', location: '1998 Broadway, New York, NY 10023, USA', description: 'Eternals', startTime: '2022-01-08 21:15:00', endTime: '2022-01-08 23:15:00', tripId: nyc.id, place_id: 'ChIJtcljhoZYwokRQZjDXiCA304', lat: 40.7751676, lng: -73.9819053 }),
    Event.create({ name: 'Lilia', location: '567 Union Ave, Brooklyn, NY 11211, USA', description: "pasta pasta pasta", startTime: '2022-01-09 20:00:00', endTime: '2022-01-09 22:00:00', tripId: nyc.id, place_id: 'ChIJJXCD6ltZwokRJ_cwjKQH63c', lat: 40.7175365, lng: -73.9524225 }),
    Event.create({ name: 'Whitney Museum', location: '99 Gansevoort St, New York, NY 10014, USA', description: 'culture time', startTime: '2022-01-11 10:15:00', endTime: '2022-01-11 12:15:00', tripId: nyc.id, place_id: 'ChIJN3MJ6pRYwokRiXg91flSP8Y', lat: 40.7395877, lng: -74.0088629 }),
    Event.create({ name: 'Hiking', location: 'Rocky Face Mountain, North Carolina 28716, USA', description: 'Group hiking', startTime: '2021-12-02 08:00:00', endTime: '2021-12-02 10:00:00', tripId: charlotte.id, place_id: 'ChIJdenvAr6bWYgRLX-EhoXIm4s', lat: 35.4653854, lng: -82.7992976 }),
    Event.create({ name: 'Infused Bar', location: "312 N Myers St #3041, Charlotte, NC 28204", description: '', startTime: '2021-12-02 20:00:00', endTime: '2021-12-02 23:00:00', tripId: charlotte.id, place_id: 'ChIJ_4Hm7SGgVogRNoZBXcKQn74', lat: 35.223096, lng: -80.8332363 }),
    Event.create({ name: 'Perez Art Museum', location: '1103 Biscayne Blvd, Miami, FL 33132, USA', description: 'Museum visit', startTime: '2021-12-13 08:00:00', endTime: '2021-12-13 10:00:00', tripId: miami.id, place_id: 'ChIJAUUpLJq22YgRAU604E8-tsM', lat: 25.7859307, lng: -80.1861912 }),
    Event.create({ name: 'Fun at Mama Tried', location: '207 NE 1st St, Miami, FL 33132, USA', description: 'cocktails and pool', startTime: '2021-12-14 20:00:00', endTime: '2021-12-14 03:00:00', tripId: miami.id, place_id: 'ChIJL7nwMRi32YgRPgB_p4PMTXk', lat: 25.7753682, lng: -80.1901163 }),
    Event.create({ name: 'Dinner at Comice', location: '31 Av. de Versailles, 75016 Paris, France', description: 'awesome food', startTime: '2021-12-21 20:00:00', endTime: '2021-12-21 22:59:59', tripId: paris.id, place_id: 'ChIJAc56Jah65kcRPUvIVLIaIjI', lat: 48.8494621, lng: 2.2760438 }),
    Event.create({ name: 'Louvre', location: 'Rue de Rivoli, 75001 Paris, France', description: 'art!!', startTime: '2021-12-23 10:00:00', endTime: '2021-12-23 13:00:00', tripId: paris.id, place_id: 'ChIJPStI0CVu5kcRUBqUaMOCCwU', lat: 48.8640396, lng: 2.3311563 }),
    Event.create({ name: 'Dinner at Francie', location: '136 Broadway, Brooklyn, NY 11249, USA', description: "start the evening with some duck", startTime: '2022-01-07 20:00:00', endTime: '2022-01-07 22:30:00', tripId: friday.id, place_id: 'ChIJ35V_tZlbwokRzolpCln-mG4', lat: 40.710268, lng: -73.9639045 }),
    Event.create({ name: 'Drinks at Pokito', location: '155 S 4th St, Brooklyn, NY 11211, USA', description: 'cocktails', startTime: '2022-01-07 23:00:00', endTime: '2022-01-08 01:00:00', tripId: friday.id, place_id: 'ChIJ3xcwmt9bwokRegnPhKtAL7U', lat: 40.71161300000001, lng: -73.9618029 }),
    Event.create({ name: 'Moodring', location: '1260 Myrtle Ave, Brooklyn, NY 11221, USA', description: 'cool dj and dancing yay', startTime: '2022-01-08 01:30:00', endTime: '2022-01-08 04:00:00', tripId: friday.id, place_id: 'ChIJp5MjfgVcwokREwMdmFvtrQ8', lat: 40.6978453, lng: -73.92699999999999 }),
  ])

  const expenses = await Promise.all([
    Expense.create({ name: 'Movie tickets', amount: 60, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id, datePaid: '2022-01-08' }),
    Expense.create({ name: 'dinner', amount: 200, tripId: nyc.id, paidById: corinne.id, categoryId: food_and_drink.id, datePaid: '2022-01-09' }),
    Expense.create({ name: 'whitney', amount: 80, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id, datePaid: '2022-01-11' }),
    Expense.create({ name: 'Uber to Rocky Face Mountain', amount: 35, tripId: charlotte.id, paidById: jonathan.id, categoryId: transportation.id, datePaid: '2021-12-02' }),
    Expense.create({ name: 'drinks', amount: 150, tripId: charlotte.id, paidById: andy.id, categoryId: food_and_drink.id, datePaid: '2021-12-03' }),
    Expense.create({ name: 'Museum tickets', amount: 80, tripId: miami.id, paidById: corinne.id, categoryId: entertainment.id, datePaid: '2021-12-13' }),
    Expense.create({ name: 'car', amount: 30, tripId: miami.id, paidById: andy.id, categoryId: transportation.id, datePaid: '2021-12-14' }),
    Expense.create({ name: 'museum gift shop', amount: 65, tripId: miami.id, paidById: jonathan.id, categoryId: other.id, datePaid: '2021-12-13' }),
    Expense.create({ name: 'Dinner at Comice', amount: 150, tripId: paris.id, paidById: corinne.id, categoryId: food_and_drink.id, datePaid: '2021-12-21' }),
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
    UserTrip.create({ userId: prof.id, tripId: friday.id }),
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
    UserFriend.create({ userId: prof.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: prof.id, status: 'accepted' }),
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
    Message.create({ content: "Can't wait for this!!", tripId: friday.id, sentById: jason.id, dateSent: '2021-12-03T09:13:34.000Z' }),
    Message.create({ content: "I miss you prof :( ", tripId: friday.id, sentById: stanley.id, dateSent: '2021-12-03T09:16:34.000Z' }),
    Message.create({ content: "Don't worry, we'll be reunited soon!", tripId: friday.id, sentById: prof.id, dateSent: '2021-12-03T11:25:34.000Z' }),
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