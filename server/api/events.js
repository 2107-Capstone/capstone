const router = require('express').Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const { models: { User, Trip, UserTrip, Event } } = require('../db')
const axios = require('axios')
require('dotenv').config()

const API_KEY = process.env.MAP_API

module.exports = router

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user
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
    res.send(events)
  }
  catch (err) {
    next(err)
  }
})

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user
    const { name, location, description, startTime, endTime, trip } = req.body;
    const responsePlace = (await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input: (`${location}+${trip.trip.location}`).split(' ').join('+'),
        radius: 500,
        key: API_KEY,
      }
    })).data;
    const responseLatLng = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        place_id: responsePlace.predictions[0].place_id,
        key: API_KEY
      }
    })).data;
    const googleLocation = responseLatLng.results[0].geometry.location
    let event = await Event.create({ name, location, description, startTime, endTime, tripId: trip.tripId, place_id: responsePlace.predictions[0].place_id, lat: googleLocation.lat, lng: googleLocation.lng }, {
      include: Trip
    })

    res.send(event)
  }
  catch (err) {
    next(err)
  }
})

router.put('/:eventId', isLoggedIn, async (req, res, next) => {
  try {
    const { name, description, location, startTime, endTime, trip } = req.body;
    const responsePlace = (await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input: (`${location}+${trip.trip.location}`).split(' ').join('+'),
        radius: 500,
        key: API_KEY,
      }
    })).data;
    const responseLatLng = (await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        place_id: responsePlace.predictions[0].place_id,
        key: API_KEY,
      }
    })).data;
    const googleLocation = responseLatLng.results[0].geometry.location
    let event = await Event.findByPk(req.params.eventId)
    await event.update({ ...event, name, description, location, startTime, endTime, tripId: trip.tripId, place_id: responsePlace.predictions[0].place_id, lat: googleLocation.lat, lng: googleLocation.lng })
    event = await Event.findByPk(event.id, {
      include: Trip
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})
router.delete('/:eventId', isLoggedIn, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId)
    await event.destroy()
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})
