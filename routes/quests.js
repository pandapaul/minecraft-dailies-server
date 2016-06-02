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

module.exports = router;
