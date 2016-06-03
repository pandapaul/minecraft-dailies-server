var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var activitySchema = mongoose.Schema({
    username: {type: String, index: true},
    quest: {type: ObjectId, ref: 'Quest'},
    action: String,
    date: {type: Date, default: Date.now}
});

activitySchema.statics.findForUser = function (username) {
    return this.find({
        username: username
    }).sort({
        date: 'descending'
    }).populate('quest');
};

activitySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

var activityModel = mongoose.model('Activity', activitySchema);

module.exports = activityModel;
