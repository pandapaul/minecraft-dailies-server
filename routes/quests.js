var express = require('express');
var router = express.Router();
var questFetcher = require('../questFetcher');

router.get('/', function (req, res) {
    var quests = questFetcher.fetch();
    res.json(quests);
});

module.exports = router;
