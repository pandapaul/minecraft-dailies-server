var db = require('./db');
var questGenerator = require('./questGenerator');
var questsToGeneratePerDay = 5;

function fetchDailies() {
    return db.quest.findTodaysQuests()
        .then(function (quests) {
            if (quests && quests.length) {
                return quests;
            } else {
                return questGenerator.generate(questsToGeneratePerDay);
            }
        });
}

function fetchQuestById(questId) {
    return db.quest.findByQuestId(questId);
}

module.exports = {
    fetchDailies: fetchDailies,
    fetchQuestById: fetchQuestById
};
