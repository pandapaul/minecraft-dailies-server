'use strict';
const express = require('express');
const router = express.Router({
    mergeParams: true
});
const quests = require('./quests');
const stats = require('./stats');
const db = require('../db');

/**
 * @api {get} /:username/ Get a User's Profile
 * @apiGroup Users
 * @apiVersion 1.0.0
 */
router.use('/', express.static('static/userProfile'));

/**
 * @api {get} /:username/:activities Get a User's Activities
 * @apiGroup Users
 * @apiVersion 1.0.0
 */
router.get('/activities', function (req, res, next) {
    db.activity.findForUser(req.params.username)
        .then(function (activities) {
            res.json(activities);
        })
        .catch(function (err) {
            next(err);
        });
});

router.use('/quests', quests);
router.use('/stats', stats);

module.exports = router;
