var db = require('./db');
var questGenerator = require('./questGenerator');
var questsToGeneratePerDay = 5;

function fetch() {
    return db.quest.findTodaysQuests()
        .then(function (quests) {
            if (quests && quests.length) {
                return quests;
            } else {
                return questGenerator.generate(questsToGeneratePerDay);
            }
        });
}

module.exports = {
    fetch: fetch
};
