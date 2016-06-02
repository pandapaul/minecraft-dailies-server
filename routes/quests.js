var express = require('express');
var router = express.Router({
    mergeParams: true
});
var questFetcher = require('../questFetcher');
var authenticate = require('../authenticate');
var db = require('../db');
var Activity = db.activity;

router.get('/', function (req, res) {
    questFetcher.fetchDailies()
        .then(function (quests) {
            res.json(quests);
        });
});

router.get('/:questId', function (req, res) {
    questFetcher.fetchQuestById(req.params.questId)
        .then(function (quest) {
            res.json(quest);
        })
        .catch(function (err) {
            next(err);
        });
});

router.use('/:questId', function (req, res, next) {
    authenticate(req)
        .then(function (data) {
            return validateQuestId(req.params.questId);
        })
        .then(function (questIsValid) {
            if (questIsValid) {
                next();
            } else {
                return Promise.reject('Invalid quest ID');
            }
        })
        .catch(function (err) {
            next(err);
        });
});

function validateQuestId(questId) {
    return questFetcher.fetchQuestById(questId)
        .then(function (quest) {
            if (quest && quest.id === questId) {
                return true;
            } else {
                return false;
            }
        })
        .catch(function () {
            return false;
        });
}

router.post('/:questId/accept', function (req, res, next) {
    createActivity(req, res, next, 'accept');
});

router.post('/:questId/complete', function (req, res, next) {
    createActivity(req, res, next, 'complete');
});

router.post('/:questId/abandon', function (req, res, next) {
    createActivity(req, res, next, 'abandon');
});

function createActivity(req, res, next, action) {
    var activity = new Activity({
        username: req.params.username || req.body.username,
        questId: req.params.questId,
        action: action
    });
    activity.save()
        .then(function () {
            res.json(activity);
        })
        .catch(function (err) {
            next(err);
        });
}

module.exports = router;
