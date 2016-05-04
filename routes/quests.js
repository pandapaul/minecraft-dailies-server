var express = require('express');
var router = express.Router();
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

router.post('/:questId', function (req, res, next) {
    validateQuestId(req.params.questId)
        .then(authenticate(req))
        .then(next)
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

});

router.post('/:questId/complete', function (req, res) {

});

router.post('/:questId/abandon', function (req, res) {

});

module.exports = router;
