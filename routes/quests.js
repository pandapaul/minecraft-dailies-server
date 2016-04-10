var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();

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
    return quests;
}

function generateQuest() {
    var type = questType();
    var target = questTarget(type);
    var reward = questReward();

    return {
        type: type,
        target: target,
        reward: reward
    };
}

function questType() {
    return chance.pickone([
        'hunt',
        'gather'
    ]);
}

function questTarget(type) {
    var target = {};
    if (type === 'hunt') {
        target.type = chance.pickone([
            'zombie',
            'skeleton',
            'creeper',
            'spider'
        ]);
        target.quantity = 10;
    } else if (type === 'gather') {
        target = chance.pickone([
            {
                type: 'iron',
                quantity: 20
            },
            {
                type: 'gold',
                quantity: 15
            },
            {
                type: 'diamond',
                quantity: 5
            },
            {
                type: 'redstone',
                quantity: 30
            },
            {
                type: 'emerald',
                quantity: 5
            }
        ]);
    }

    return target;
}

function questReward() {
    var multiplier = chance.normal({
        mean: 1,
        dev: 0.15
    });
    return {
        type: 'xp',
        quantity: Math.round((multiplier * 5000))
    };
}

module.exports = router;
