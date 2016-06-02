var mongoose = require('mongoose');
var cleanFindModifier = '-_id username questId action date';

var activitySchema = mongoose.Schema({
    username: String,
    questId: String,
    action: String,
    date: {type: Date, default: Date.now}
});

activitySchema.statics.findForUser = function (username) {
    return this.find({
        username: username
    }, cleanFindModifier).sort({
        date: 'descending'
    });
};

var activityModel = mongoose.model('Activity', activitySchema);

module.exports = activityModel;
