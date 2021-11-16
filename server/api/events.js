const router = require('express').Router()
const { models: { User, Trip, UserTrip, Event }} = require('../db')

const axios = require('axios')
//TODO: move api key
const api_key = 'AIzaSyDTDZbcrs5acxP8RwgsZjK2CMelScdM4BA'

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

        console.log(event.location)
        console.log((`${event.location}+${event.trip.location}`).split(' ').join('+'))
        try {
            const responsePlace = (await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
                params: {
                    input: (`${event.location}+${event.trip.location}`).split(' ').join('+'),
                    radius:500,
                    key: api_key,
                }
            })).data;
            const responseLatLng = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    place_id: responsePlace.predictions[0].place_id,
                    key: api_key,
                }
            })).data;
            const location = responseLatLng.results[0].geometry.location
            await event.update({...event, place_id: responsePlace.predictions[0].place_id, lat: location.lat, lng: location.lng})
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

router.post('/', async (req, res, next) => {
  if (req.headers.authorization === 'null') {
    console.log('YOU SHALL NOT PASS!')
    return res.send([])
  }
  try {
    const user = await User.findByToken(req.headers.authorization)
    if (user) {
      const { name, location, description, startTime, endTime, trip } = req.body;
      const responsePlace = (await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
                params: {
                    input: (`${location}+${trip.trip.location}`).split(' ').join('+'),
                    radius:500,
                    key: api_key,
                }
      })).data;
            const responseLatLng = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    place_id: responsePlace.predictions[0].place_id,
                    key: api_key,
                }
            })).data;
            const googleLocation = responseLatLng.results[0].geometry.location
            let event = await Event.create({name, location, description, startTime, endTime, tripId: trip.tripId, place_id: responsePlace.predictions[0].place_id, lat: googleLocation.lat, lng: googleLocation.lng})
    
      res.send(event)
    } else {
      //TODO Avoid an error message in our console if we can't find a user.
      res.send('No current user found via token.')
    }
  } catch (err) {
    next(err)
  }
})