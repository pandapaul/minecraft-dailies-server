var db = require('./db');
var questGenerator = require('./questGenerator');

function fetchQuestInventory(username) {
    var questInventoryMap = {};
    return fetchDailies()
        .then(function (dailies) {
            dailies.forEach(function (quest) {
                quest.status = 'available';
                questInventoryMap[quest.id] = quest;
            });
            return db.progression.findForUserAndQuests(username, dailies);
        })
        .then(function (dailyProgressions) {
            dailyProgressions.forEach(function (progression) {
                if (progression.status === 'complete') {
                    delete questInventoryMap[progression.quest];
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
                questInventoryMap[progression.quest.id] = progression.quest;
            });
            var questInventory = [];
            for (var quest in questInventoryMap) {
                if (!questInventoryMap.hasOwnProperty(quest)) {
                    continue;
                }
                questInventory.push(questGenerator.inflateQuest(questInventoryMap[quest]));
            }
            return questInventory;
        });
}

function fetchDailies() {
    return db.quest.findTodaysQuests()
        .then(function (quests) {
            if (quests && quests.length) {
                return questGenerator.inflateQuests(quests);
            } else {
                return questGenerator.generateDailies();
            }
        });
}

function fetchQuestById(questId) {
    return db.quest.findByQuestId(questId)
        .then(function (quest) {
            return questGenerator.inflateQuest(quest);
        });
}

module.exports = {
    fetchDailies: fetchDailies,
    fetchQuestById: fetchQuestById,
    fetchQuestInventory: fetchQuestInventory
};
