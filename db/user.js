var mongoose = require('mongoose');
var cleanFindModifier = '-_id id';
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
    username: {type: String, index: {unique: true}},
    quests: {
        inProgress: [{type: ObjectId, ref: 'Quest'}],
        complete: [{type: ObjectId, ref: 'Quest'}]
    }
}, {
    timestamps: true
});

userSchema.statics.findWithQuestsPopulated = function (username) {
    return this.findOne({
        username: username
    }).populate('quests.inProgress quests.complete');
};

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;
