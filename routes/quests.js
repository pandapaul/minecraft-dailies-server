var express = require('express');
var router = express.Router({
    mergeParams: true
});
var questFetcher = require('../questFetcher');
var authenticate = require('../authenticate');
var db = require('../db');
var Activity = db.activity;

router.get('/', function (req, res) {
    questFetcher.fetchDailies(req.params.username)
        .then(function (quests) {
            res.json(quests);
        });
});

router.get('/:questId', function (req, res, next) {
    questFetcher.fetchQuestById(req.params.questId)
        .then(function (quest) {
            res.json(quest);
        })
        .catch(next);
});

router.use('/:questId', function (req, res, next) {
    authenticate(req)
        .then(function () {
            return validateQuestId(req.params.questId);
        })
        .then(function () {
            return fetchQuestStatus(req);
        })
        .then(next)
        .catch(next);
});

function validateQuestId(questId) {
    return new Promise(function (resolve, reject) {
        questFetcher.fetchQuestById(questId)
            .then(function (quest) {
                if (quest && quest.id === questId) {
                    return resolve();
                } else {
                    return reject('Invalid quest ID');
                }
            })
            .catch(function (err) {
                return reject('Invalid quest ID');
            });
    });
}

function fetchQuestStatus(req) {
    var username = req.params.username;
    var questId = req.params.questId;
    return db.progression.findForUserAndQuest(username, questId)
        .then(function (progression) {
            req.questStatus = progression && progression.status;
        });
}

router.post('/:questId/accept', function (req, res, next) {
    var username = req.params.username || req.body.username;
    var questId = req.params.questId;
    if (!req.questStatus) {
        updateQuestStatus(username, questId, 'accepted')
            .then(function () {
                createActivity(req, res, next, 'accept');
            })
            .catch(next);
    } else {
        next('Invalid quest status [' + req.questStatus + ']');
    }
});

router.post('/:questId/progress', function (req, res, next) {
    var username = req.params.username || req.body.username;
    var questId = req.params.questId;
    var progress = req.body.progress;
    
    if (!progress) {
        next('Invalid progress [' + progress + ']');
    }
    
    if (req.questStatus === 'accepted') {
        updateQuestProgress(username, questId, progress)
            .then(function () {
                res.json({
                    username: username,
                    questId: questId,
                    progress: progress
                });
            })
            .catch(next);
    } else {
        next('Invalid quest status [' + req.questStatus + ']');
    }
});

router.post('/:questId/complete', function (req, res, next) {
    var username = req.params.username || req.body.username;
    var questId = req.params.questId;
    if (req.questStatus === 'accepted') {
        updateQuestStatus(username, questId, 'complete')
            .then(function () {
                createActivity(req, res, next, 'complete');
            })
            .catch(next);
    } else {
        next('Invalid quest status [' + req.questStatus + ']');
    }
});

router.post('/:questId/abandon', function (req, res, next) {
    var username = req.params.username || req.body.username;
    var questId = req.params.questId;
    if (req.questStatus === 'accepted') {
        updateQuestStatus(username, questId, null)
            .then(function () {
                createActivity(req, res, next, 'abandon');
            })
            .catch(next);
    } else {
        next('Invalid quest status [' + req.questStatus + ']');
    }
});

function updateQuestStatus(username, questId, status) {
    return db.progression.upsert({
        username: username,
        quest: questId,
        status: status
    });
}

function updateQuestProgress(username, questId, progress) {
    return db.progression.upsert({
        username: username,
        quest: questId,
        progress: progress
    });
}

function createActivity(req, res, next, action) {
    var activity = new Activity({
        username: req.params.username || req.body.username,
        quest: req.params.questId,
        action: action
    });
    activity.save()
        .then(function () {
            res.json(activity);
        })
        .catch(next);
}

module.exports = router;
