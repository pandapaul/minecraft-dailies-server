var express = require('express');
var router = express.Router({
    mergeParams: true
});
var quests = require('./quests');
var db = require('../db');

/**
 * @api {post} /:username/ Get a User's Profile
 * @apiGroup Users
 * @apiVersion 1.0.0
 */
router.get('/', function (req, res) {
    // TODO add fetching for user info
    res.send("Hey what's up?  You asked for user " + req.params.username + ". This is only a placeholder, though.");
});

/**
 * @api {post} /:username/:activities Get a User's Activities
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

module.exports = router;
