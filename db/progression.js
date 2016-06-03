var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var progressionSchema = mongoose.Schema({
    username: String,
    quest: {type: ObjectId, ref: 'Quest'},
    status: String
});

progressionSchema.index({username: 1, quest: 1});

progressionSchema.statics.findForUserAndQuest = function (username, questId) {
    return this.find({
        username: username,
        quest: questId
    });
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
