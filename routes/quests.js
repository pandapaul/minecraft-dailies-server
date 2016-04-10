var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    var quests = generateQuests();
    res.json(quests);
});

function generateQuests() {
    var quests = [];
    var numberOfQuestsToGenerate = 5;
    while (numberOfQuestsToGenerate) {
        numberOfQuestsToGenerate--;
        quests.push(generateQuest());
    }
}

function generateQuest() {
    return {
        
    };
}

module.exports = router;
