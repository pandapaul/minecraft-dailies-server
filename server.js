'use strict'
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const quests = require('./routes/quests')
const users = require('./routes/users')
const db = require('./db')
const stats = require('./routes/stats')
const activities = require('./routes/activities')

setupIo()
setupCors()
setupRoutes()
connectToDb()
    .then(listen)
    .catch(logDbConnectionError)

function setupRoutes () {
  app.use(express.static('static'))
  app.use(bodyParser.json())
  app.use('/quests', quests)
  app.use('/activities', activities)
  app.use('/:username', users)
  app.use('/stats', stats)
  app.use(basicErrorHandling)
}

function setupCors () {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })
}

function connectToDb () {
  return db.connect()
}

function setupIo () {
  app.io = io
}

function listen () {
  const listenPort = process.env.PORT || 5000
  http.listen(listenPort)
  console.log('Listening on port ' + listenPort)
}

function logDbConnectionError (error) {
  console.log('Database Connection Error:', error)
}

function basicErrorHandling (err, req, res, next) {
  if (err.stack) {
    console.error(err.stack)
    res.status(500).json({
      error: 'Unfortunately an error has occurred.'
    })
  } else {
    res.status(400).json({
      error: err
    })
  }
}
