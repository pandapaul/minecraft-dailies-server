var mongoose = require('mongoose');
var cleanFindModifier = '-_id id';

var userSchema = mongoose.Schema({
    username: {type: String, index: {unique: true}},
    quests: {
        available: [{type: String, ref: 'Quest'}],
        inProgress: [{type: String, ref: 'Quest'}]
    }
}, {
    timestamps: true
});

userSchema.statics.findWithQuestsPopulated = function (username) {
    return this.findOne({
        username: username
    }).populate('quests.available quests.inProgress');
};

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;
