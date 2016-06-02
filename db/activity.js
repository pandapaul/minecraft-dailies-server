var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    username: String,
    questId: String,
    action: String
}, {
    timestamps: true
});

activitySchema.statics.findForUser = function (username) {
    return this.find({
        username: username
    }).sort({
        createdAt: 'descending'
    });
};

var activityModel = mongoose.model('Activity', activitySchema);

module.exports = activityModel;
