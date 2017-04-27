'use strict'
const express = require('express')
const router = express.Router()
const db = require('../db')

/**
 * @api {get} /activities Get Recent Activities
 * @apiGroup Activity
 * @apiVersion 1.0.0
 */
router.get('/', function (req, res, next) {
  db.activity.findRecent()
        .then(function (activities) {
          res.json(activities)
        })
        .catch(next)
})

module.exports = router
