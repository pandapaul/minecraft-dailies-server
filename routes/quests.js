var express = require('express');
var router = express.Router();
var questFetcher = require('../questFetcher');

router.get('/', function (req, res) {
    questFetcher.fetch()
        .then(function (quests) {
            res.json(quests);
        });
});

module.exports = router;
