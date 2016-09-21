'use strict';
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const usernameRegexer = require('./usernameRegexer');

const progressionSchema = mongoose.Schema({
    username: String,
    quest: {type: ObjectId, ref: 'Quest'},
    status: String,
    progress: Number
});

progressionSchema.index({username: 1, quest: 1}, {unique: true});

progressionSchema.statics.findForUserAndQuests = function (username, quests) {
    let questIds = [];
    if (quests && quests[0] && quests[0].id) {
        quests.forEach(function (quest, index, array) {
            questIds.push(quest.id);
        });
    } else {
        questIds = quests || [];
    }

    return this.find({
        username: usernameRegexer(username)
    }).where('quest').in(questIds);
};

progressionSchema.statics.findForUserAndQuest = function (username, questId) {
    return this.findOne({
        username: usernameRegexer(username),
        quest: questId
    });
};

progressionSchema.statics.upsert = function (progression) {
    return this.findOneAndUpdate({
        username: progression.username,
        quest: progression.quest
    }, progression, {upsert: true});
};

progressionSchema.statics.countAcceptedQuests = function (username) {
    const filter = {
        status: 'accepted'
    };

    if (username !== undefined) {
        filter.username = usernameRegexer(username);
    }

    return this.count(filter);
};

progressionSchema.statics.countCompletions = function (username) {
    const filter = {
        status: 'complete'
    };

    if (username !== undefined) {
        filter.username = usernameRegexer(username);
    }

    return this.count(filter);
};

progressionSchema.statics.countUsers = function (username) {
    return this.distinct('username').then(function (progressions) {
        return progressions.length;
    });
};

progressionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const progressionModel = mongoose.model('Progression', progressionSchema);

module.exports = progressionModel;
