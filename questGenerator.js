var chance = require('chance').Chance();
var db = require('./db');
var Quest = db.quest;
var quests = require('./questLoader').load();
var questsMap = {};

quests.forEach(function (quest) {
    questsMap[quest.name] = quest;
});

function generateDailies() {
    var dailies = chance.pickset(quests, 5);
    dailies.forEach(function (daily) {
        new Quest({
            name: daily.name
        }).save().catch(function (err) {
            console.log('ERROR - Unable to save generated daily - ', err);
        });
    });
    return dailies;
}

function inflateQuest(dbQuest) {
    var quest = {};
    if (dbQuest && dbQuest.name) {
        quest = questsMap[dbQuest.name];
    }
    quest.status = dbQuest.status;
    quest.progress = dbQuest.progress;
    quest.id = dbQuest.id;
    return quest;
}

function inflateQuests(dbQuests) {
    var quests = [];
    dbQuests.forEach(function (dbQuest) {
        quests.push(inflateQuest(dbQuest));
    });
    return quests;
}

module.exports = {
    generateDailies: generateDailies,
    inflateQuest: inflateQuest,
    inflateQuests: inflateQuests
};
