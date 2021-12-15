'use strict'
const faker = require('faker');
const moment = require('moment')
const addresses = require('./rrad.json').addresses;
const { db, models: { User, Category, Event, Expense, Message, Trip, UserTrip, UserFriend, UserDebt } } = require('../server/db')

/////// import image //////////////////
const airplane = '/images/airplane.png'
/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seedFaker() {
  const numUsers = 100;
  const numTrips = 80;
  
  // Creating Users
  
  const usersToCreate = Array(numUsers).fill().map((user) => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: `${faker.lorem.word()}${(Math.random() * 1000).toFixed(0)}`,
    email: faker.internet.email(),
    phoneNumber: 1+faker.phone.phoneNumberFormat().replace(/\-/g,''),
    password: '123',
  }))
  // console.log(usersToCreate)
  const users = await Promise.all(usersToCreate.map(user => 
    User.create(user)
  ))
  // console.log('usersCount', await User.count())
// console.log('users', users)
// console.log(users[1].id)
  // Creating Trips
  let tripsToCreate = Array(numTrips).fill().map(() => {
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)]
    const startTime = faker.date.future();
    const endTime = moment(startTime).add(Math.random() * 14, 'days')

    return({
        name: `Trip to ${randomAddress.city}`,
        location: `${randomAddress.city}, ${randomAddress.state}`,
        description: faker.lorem.sentence(5),
        startTime: startTime,
        endTime: endTime.toISOString(),
        lat: randomAddress.coordinates.lat,
        lng: randomAddress.coordinates.lng,
        userId:  users[Math.floor(Math.random() * numUsers)].id,
        imageUrl: airplane 
    })
  })
  // console.log(tripsToCreate)
  const trips = await Promise.all(tripsToCreate.map(trip => 
    Trip.create(trip)
  ))
// console.log(trips[0].id)
  await Promise.all(trips.map((trip, idx) => 
    UserTrip.create({
      userId: trips[idx].userId,
      tripId: trips[idx].id
    })
  ))

//   await Promise.all(trips.map(async trip => {
//     const numInTrip = Math.ceil(Math.random() * 8)
//     const accepted = Math.floor(Math.random() * 2)
    
//     for (let i = 1; i <= numInTrip; i++){
//       const userIdx = Math.ceil(Math.random() * numUsers)
//       // console.log(users[userIdx].id)
//       if (users[userIdx]?.id !== trip.userId){
//         await UserTrip.create({
//           userId: users[userIdx].id,
//           tripId: trip.id,
//           tripInvite: accepted === 1 ? 'accepted' : 'pending'
//         })
//         // console.log('usertrip created')
//         await UserFriend.create({
//           userId: users[userIdx].id,
//           friendId: trip.userId,
//           status: 'accepted'
//         });
//         await UserFriend.create({
//           friendId: users[userIdx].id,
//           userId: trip.userId,
//           status: 'accepted'
//         })
//         // console.log('userfriends created')
//         await Message.create({
//           sentById: users[userIdx].id,
//           content: faker.lorem.sentences(2),
//           tripId: trip.id,
//           dateSent: faker.date.future(1/365/trip.startTime)
//         })
//         // console.log('message created')
//         await Expense.create({
//           paidById: users[userIdx].id,
//           amount: Math.ceil(Math.random() * 900).toFixed(2),
//           categoryId: Math.ceil(Math.random() * 4),
//           name: faker.company.companyName(),
//           datePaid: faker.date.future(1/365/trip.startTime)
//         })
//         // console.log('expense created')
//       }
//     }
// //TODO: make it be in the area of the trip
//     const numEvents = Math.ceil(Math.random() * 8)
//     for (let j = 1; j <= numEvents; j++){
//       const randomAddress = addresses[Math.floor(Math.random() * addresses.length)]
//       const startTime = faker.date.future(1/365,trip.startTime);
//       const endTime = moment(startTime).add(Math.random() * 1, 'hours')
//       const event = {
//         name: faker.company.companyName(),
//         location: `${randomAddress.address1}, ${randomAddress.city}, ${randomAddress.state}`,
//         description: faker.lorem.sentence(5),
//         startTime: startTime,
//         endTime: endTime.toISOString(),
//         tripId: trip.id,
//         lat: randomAddress.coordinates.lat,
//         lng: randomAddress.coordinates.lng
//       }
//       await Event.create(event)
//       // console.log('event created')

//       // console.log(trip.id)
//       // console.log(thisEvent)
//     }

//   }))


//   console.log(`seeded ${users.length} users`)
//   console.log(`seeded ${trips.length} trips`)
  console.log(`seeded successfully`)
}
//   return {
//     users: {
//       andy,
//       corinne,
//       jonathan,
//       jason,
//       stanley
//     },
//     categories: {
//       food_and_drink,
//       entertainment,
//       transportation,
//       other
//     },
//     events,
//     expenses,
//     messages,
//     trips: {
//       nyc,
//       charlotte,
//       miami,
//       paris,
//       friday,
//       nye
//     },
//     userTrips,
//     userFriends,
//     userDebt
//   }
// }

module.exports = seedFaker