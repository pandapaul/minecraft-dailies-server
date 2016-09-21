'use strict';
const express = require('express');
const router = express.Router({
    mergeParams: true
});
const db = require('../db');

/**
 * @api {get} /completions Get a count of quest completions
 * @apiGroup Stats
 * @apiVersion 1.0.0
 */
router.get('/completions', function (req, res, next) {
    db.progression.countCompletions(req.params.username)
        .then(function (count) {
            res.json(count);
        })
        .catch(function (err) {
            next(err);
        });
});

/**
 * @api {get} /users Get a count of users who have progressions
 * @apiGroup Stats
 * @apiVersion 1.0.0
 */
router.get('/users', function (req, res, next) {
    db.progression.countUsers()
        .then(function (count) {
            res.json(count);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
