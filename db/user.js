var mongoose = require('mongoose');
var cleanFindModifier = '-_id id';

var userSchema = mongoose.Schema({
    username: {type: String, index: {unique: true}},
    quests: {
        inProgress: [{type: String, ref: 'Quest'}],
        complete: [{type: String, ref: 'Quest'}]
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
