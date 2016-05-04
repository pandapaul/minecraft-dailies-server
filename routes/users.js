var express = require('express');
var router = express.Router();

router.get('/:username', function (req, res) {
    // TODO add fetching for user info
    res.send("Hey what's up?  You asked for user " + req.params.username + ". This is only a placeholder, though.");
});

module.exports = router;
