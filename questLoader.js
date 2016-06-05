var fs = require('fs');
var questsDirectory = 'quests';
var quests = [];

function load () {
    if (quests.length) {
        return quests;
    }
    var filenames = fs.readdirSync(questsDirectory);
    filenames.forEach(function (filename) {
        var fileContents = fs.readFileSync(questsDirectory + '/' + filename, 'utf-8');
        var quest = JSON.parse(fileContents);
        quests.push(quest);
    });
    return quests;
}

module.exports = {
    load: load
};
