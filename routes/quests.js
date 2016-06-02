var express = require('express');
var router = express.Router({
    mergeParams: true
});
var questFetcher = require('../questFetcher');
var authenticate = require('../authenticate');

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

router.post('/:questId/accept', function (req, res) {
    res.end();
});

router.post('/:questId/complete', function (req, res) {
    res.end();
});

router.post('/:questId/abandon', function (req, res) {
    res.end();
});

module.exports = router;
