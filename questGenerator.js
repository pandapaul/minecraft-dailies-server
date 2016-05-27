var chance = require('chance').Chance();
var db = require('./db');

function generateQuests(quantity) {
    quantity = Math.max(quantity || 0, 0);
    var quests = [];
    while (quantity) {
        quantity--;
        quests.push(generateQuest());
    }
    return quests;
}

function generateQuest() {
    var id = questId();
    var type = questType();
    var target = questTarget(type);
    var reward = questReward();

    var questData = {
        id: id,
        type: type,
        target: target,
        reward: reward
    };

    new db.quest(questData).save()
        .catch(function (err) {
            console.log('ERROR - Unable to save generated quest - ', err);
        });

    return questData;
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
        dev: 0.25
    });
    return chance.pickone([{
        type: 384, //bottle o' enchanting
        quantity: Math.round(multiplier * 30)
    }, {
      type: 264, //diamonds! yay!
      quantity: Math.round(multiplier * 5)
    }]);
}

function generate(quantity) {
    if (quantity === undefined) {
        return generateQuest();
    } else {
        return generateQuests(quantity);
    }
}

module.exports = {
    generate: generate,
    generateQuests: generateQuests,
    generateQuest: generateQuest
};
