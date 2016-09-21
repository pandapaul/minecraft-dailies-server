var express = require('express');
var router = express.Router({
    mergeParams: true
});
var questFetcher = require('../questFetcher');
var questLoader = require('../questLoader');
var authenticate = require('../authenticate');
var db = require('../db');
var Activity = db.activity;

router.get('/', function (req, res, next) {
    if (req.params.username) {
        /**
         * @api {get} /:username/quests Get Quests for User
         * @apiGroup Quests
         * @apiVersion 1.0.0
         */
        questFetcher.fetchQuestInventory(req.params.username)
            .then(function (quests) {
                res.json(quests);
            }).catch(next);
    } else {
        /**
         * @api {get} /quests Get All Quests
         * @apiGroup Quests
         * @apiVersion 1.0.0
         */
        questFetcher.fetchDailies()
            .then(function (quests) {
                res.json(quests);
            }).catch(next);
    }
});

/**
 * @api {post} /:username/quests Get Quests for User
 * @apiGroup Quests
 * @apiVersion 1.1.0
 */
router.post('/', function (req, res, next) {
    if (!req.params.username) {
        next('username required when POSTing');
        return;
    }
    questFetcher.fetchQuestInventory(req.params.username, req.body.modVersion)
        .then(function (quests) {
            res.json({
                quests: quests
            });
        }).catch(next);
});

/**
 * @api {get} /quests/list Get a list of all quests
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
router.get('/list', function (req, res, next) {
    res.json(questLoader.load());
});

/**
 * @api {get} /quests/:questId Get a Specific Quest
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
/**
 * @api {get} /:username/quests/:questId Get a Specific Quest
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
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

/**
 * @api {post} /:username/quests/:questId/accept Accept a Quest
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
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

/**
 * @api {post} /:username/quests/:questId/progress/:progress Update Quest Progress
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
router.post('/:questId/progress/:progress', function (req, res, next) {
    var username = req.params.username || req.body.username;
    var questId = req.params.questId;
    var progress = req.params.progress || req.body.progress;

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

/**
 * @api {post} /:username/quests/:questId/accept Complete a Quest
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
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

/**
 * @api {post} /:username/quests/:questId/abandon Abandon a Quest
 * @apiGroup Quests
 * @apiVersion 1.0.0
 */
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
