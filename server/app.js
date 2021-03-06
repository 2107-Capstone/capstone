require('dotenv').config();
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser');

/////// use ejs to render google api key for client side ////////////
app.engine('html', ejs.renderFile)
module.exports = app

// logging middleware
app.use(morgan('dev'))

// cross origin
app.use(cors())

// body parsing middleware
app.use(express.json({ limit: '50mb' }))

// auth and api routes
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))

app.get('/', (req, res) => res.render(path.join(__dirname, '..', 'public/index.html'), { GOOGLE_KEY: process.env.GOOGLE_KEY }));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('images/', express.static(path.join(__dirname, '..', 'public', 'images')))
app.use('logo/', express.static(path.join(__dirname, '..', 'public', 'logo')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.render(path.join(__dirname, '..', 'public/index.html'), { GOOGLE_KEY: process.env.GOOGLE_KEY });
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})
