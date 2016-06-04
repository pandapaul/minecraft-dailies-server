var db = require('./db');
var questGenerator = require('./questGenerator');

function fetchQuestInventory(username) {
    var questInventory = {};
    return fetchDailies()
        .then(function (dailies) {
            dailies.forEach(function (quest) {
                quest.status = 'available';
                questInventory[quest.id] = quest;
            });
            return db.progression.findForUserAndQuests(username, dailies);
        })
        .then(function (dailyProgressions) {
            dailyProgressions.forEach(function (progression) {
                if (progression.status === 'complete') {
                    delete questInventory[progression.quest];
                }
            });
        })
        .then(function () {
            return db.progression.find({
                username: username,
                status: 'accepted'
            }).populate('quest');
        })
        .then(function (acceptedProgressions) {
            acceptedProgressions.forEach(function (progression) {
                progression.quest.status = progression.status;
                progression.quest.progress = progression.progress;
                questInventory[progression.quest.id] = progression.quest;
            });
            var questArray = [];

            return questInventory;
        });
}

function fetchDailies() {
    return db.quest.findTodaysQuests()
        .then(function (quests) {
            if (quests && quests.length) {
                return quests;
            } else {
                return questGenerator.generateDailies();
            }
        });
}

function fetchQuestById(questId) {
    return db.quest.findByQuestId(questId);
}

module.exports = {
    fetchDailies: fetchDailies,
    fetchQuestById: fetchQuestById,
    fetchQuestInventory: fetchQuestInventory
};
