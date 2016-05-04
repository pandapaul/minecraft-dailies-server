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
    var id = questId();
    var type = questType();
    var target = questTarget(type);
    var reward = questReward();

    return {
        id: id,
        type: type,
        target: target,
        reward: reward
    };
}

function questId() {
    return chance.guid();
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
            54, //zombie
            51, //skeleton
            50, //creeper
            52 //spider
        ]);
        target.quantity = 10;
    } else if (type === 'gather') {
        target = chance.pickone([
            {
                type: 265, //iron ingot
                quantity: 20
            },
            {
                type: 266, //gold ingot
                quantity: 15
            },
            {
                type: 264, //diamond
                quantity: 5
            },
            {
                type: 331, //redstone
                quantity: 30
            },
            {
                type: 388, //emerald
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
        type: 384, //bottle o' enchanting,
        quantity: Math.round((multiplier * 30))
    };
}

module.exports = router;
