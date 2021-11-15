const router = require('express').Router()
const { models: { User, Trip, UserTrip, Event }} = require('../db')

const axios = require('axios')

module.exports = router

router.get('/', async (req, res, next) => {
  if(req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.json([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const trips = await UserTrip.findAll({
        where: {
          userId: user.id
        },
        include: [
          {
            model: Trip,
            include: [Event]
          }
        ]
      })
      
      const tripIds = trips.map(trip => trip.tripId)

      let events = await Event.findAll({
        include: [
          {
            model: Trip
          }
        ]
      })

      events = events.filter(event => {
        return tripIds.includes(event.tripId)
      })
      
//USED THIS TO UPDATE EXISTING EVENTS' PLACE_IDS      
      const findEventGeo = async(event) => {
        const api_key = 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA'
        console.log(event.location)
        console.log((`${event.location}+${event.trip.location}`).split(' ').join('+'))
        try {
            const response = (await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
                params: {
                    input: (`${event.location}+${event.trip.location}`).split(' ').join('+'),
                    radius:500,
                    key: api_key,
                }
            })).data;
            const response2 = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    place_id: response.predictions[0].place_id,
                    key: api_key,
                }
            })).data;
            const location = response2.results[0].geometry.location
            await event.update({...event, place_id: response.predictions[0].place_id, lat: location.lat, lng: location.lng})
        } catch (error) {
            console.log(error)
        }
      }
      await events.map(async event => findEventGeo(event));
//      
      res.send(events)
    } else {
      res.send('No current user found via token')
    }
  } catch (err) {
    next(err)
  }
})

