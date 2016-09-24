'use strict';
const chance = require('chance').Chance();
const modVersionParser = require('./modVersionParser');
const db = require('./db');
const Quest = db.quest;
const quests = require('./questLoader').load();
const questsMap = {};

quests.forEach(function (quest) {
    questsMap[quest.name] = quest;
});

function generateDailies() {
    const dailies = chance.pickset(quests, 5);
    dailies.forEach(function (daily, index) {
        const dbQuest = new Quest({
            name: daily.name
        });
        dbQuest.save().catch(function (err) {
            console.log('ERROR - Unable to save generated daily - ', err);
        });
        dailies[index].id = dbQuest.id;
    });
    return dailies;
}

function inflateQuest(dbQuest, modVersion) {
    modVersion = modVersionParser(modVersion);
    let quest = {};
    if (dbQuest && dbQuest.name) {
        quest = questsMap[dbQuest.name];
    }

    if (quest.minimumModBuild && modVersion.modBuild < quest.minimumModBuild) {
        quest.id = chance.guid();
        quest.progress = 0;
        quest.status = 'available';
        quest.description = 'Please update mod. This quest requires build ' + quest.minimumModBuild + '.';
        quest.target = {
            type: 0,
            quantity: 100
        };
        quest.reward = {
            type: 3,
            quantity: 1
        };
    } else {
        quest.id = dbQuest.id;
        quest.progress = dbQuest.progress;
        quest.status = dbQuest.status;
    }
    return quest;
}

function inflateQuests(dbQuests) {
    const quests = [];
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
