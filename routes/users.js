var express = require('express');
var router = express.Router({
    mergeParams: true
});
var quests = require('./quests');

router.get('/', function (req, res) {
    // TODO add fetching for user info
    res.send("Hey what's up?  You asked for user " + req.params.username + ". This is only a placeholder, though.");
});

router.use('/quests', quests);

module.exports = router;
