var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var usernameRegexer = require('./usernameRegexer');

var progressionSchema = mongoose.Schema({
    username: String,
    quest: {type: ObjectId, ref: 'Quest'},
    status: String,
    progress: Number
});

progressionSchema.index({username: 1, quest: 1}, {unique: true});

progressionSchema.statics.findForUserAndQuests = function (username, quests) {
    var questIds = [];
    if (quests && quests[0] && quests[0].id) {
        quests.forEach(function (quest, index, array) {
            questIds.push(quest.id);
        });
    } else {
        questIds = quests || [];
    }
    
    var usernameRegex;
    try {
        usernameRegex = usernameRegexer(username);
    } catch (err) {
        return [];
    }

    return this.find({
        username: usernameRegex
    }).where('quest').in(questIds);
};

progressionSchema.statics.findForUserAndQuest = function (username, questId) {
    var usernameRegex;
    try {
        usernameRegex = usernameRegexer(username);
    } catch (err) {
        return null;
    }
    
    return this.findOne({
        username: usernameRegex,
        quest: questId
    });
};

progressionSchema.statics.upsert = function (progression) {
    return this.findOneAndUpdate({
        username: progression.username,
        quest: progression.quest
    }, progression, {upsert: true});
};

progressionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

var progressionModel = mongoose.model('Progression', progressionSchema);

module.exports = progressionModel;
