const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, TEXT, DATE, DECIMAL } = Sequelize
//TODO: move api key
const api_key = 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA'
const axios = require('axios')

const Event = db.define('event', {
  name: {
    type: STRING,
  },
  location: {
    type: STRING,
  },
  description: {
      type: TEXT
  },
  startTime: {
      type: DATE,
      defaultValue: new Date(),
  },
  endTime: {
      type: DATE,
  //TODO: add one hour
      defaultValue: new Date()
  },
  place_id: {
    type: STRING
  },
  lat: DECIMAL,
  lng: DECIMAL
})

module.exports = Event

// Event.beforeCreate(async (event, options) => {
//   const hashedPassword = await hashPassword(user.password);
//   user.password = hashedPassword;
// });


// const findPlaceId = async(event) => {

//   console.log(event.location)
//   console.log((`${event.location}+${event.trip.location}`).split(' ').join('+'))
//   try {
//       const responsePlace = (await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
//           params: {
//               input: (`${event.location}+${event.trip.location}`).split(' ').join('+'),
//               radius:500,
//               key: api_key,
//           }
//       })).data;
//       const responseLatLng = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//           params: {
//               place_id: responsePlace.predictions[0].place_id,
//               key: api_key,
//           }
//       })).data;
//       const location = responseLatLng.results[0].geometry.location
//       await event.update({...event, place_id: responsePlace.predictions[0].place_id, lat: location.lat, lng: location.lng})
//   } catch (error) {
//       console.log(error)
//   }
// }