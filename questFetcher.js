'use strict';
const db = require('./db');
const questGenerator = require('./questGenerator');
const usernameRegexer = require('./db/usernameRegexer');

function fetchQuestInventory(username, modVersion) {
    const questInventoryMap = {};
    const usernameRegex = usernameRegexer(username);

    return fetchDailies()
        .then(setDailiesStatusAvailable)
        .then(fetchDailiesProgressions)
        .then(removeCompleteDailies)
        .then(fetchAcceptedProgressions)
        .then(addAcceptedQuests)
        .then(buildInflatedInventory);

    function setDailiesStatusAvailable(dailies) {
        dailies.forEach(function (quest) {
            quest.status = 'available';
            questInventoryMap[quest.id] = quest;
        });
        return dailies;
    }

    function fetchDailiesProgressions(dailies) {
        return db.progression.findForUserAndQuests(username, dailies);
    }

    function removeCompleteDailies(dailyProgressions) {
        dailyProgressions.forEach(function (progression) {
            if (progression.status === 'complete') {
                delete questInventoryMap[progression.quest];
            }
        });
    }

    function fetchAcceptedProgressions() {
        return db.progression.find({
            username: usernameRegex,
            status: 'accepted'
        }).populate('quest');
    }

    function addAcceptedQuests(acceptedProgressions) {
        acceptedProgressions.forEach(function (progression) {
            progression.quest.status = progression.status;
            progression.quest.progress = progression.progress;
            questInventoryMap[progression.quest.id] = progression.quest;
        });
    }

    function buildInflatedInventory() {
        const questInventory = [];
        for (let quest in questInventoryMap) {
            if (!questInventoryMap.hasOwnProperty(quest)) {
                continue;
            }
            questInventory.push(questGenerator.inflateQuest(questInventoryMap[quest], modVersion));
        }
        return questInventory;
    }
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
