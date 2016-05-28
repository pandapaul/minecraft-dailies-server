var express = require('express');
var router = express.Router({
    mergeParams: true
});

router.get('/', function (req, res) {
    // TODO add fetching for user info
    res.send("Hey what's up?  You asked for user " + req.params.username + ". This is only a placeholder, though.");
});

router.get('/quests', function (req, res) {
    res.send('this will be the quest inventory for ' + req.params.username);
});

module.exports = router;
