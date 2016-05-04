var mongoose = require('mongoose');
var cleanFindModifier = '-_id id type target reward';

var questSchema = mongoose.Schema({
    id: {type: String, index: {unique: true}},
    type: String,
    target: {
        type: {type: Number},
        quantity: Number
    },
    reward: {
        type: {type: Number},
        quantity: Number
    }
}, {
    timestamps: true
});

questSchema.statics.findTodaysQuests = function () {
    return this.find({
        createdAt: {
            $gte: new Date().setUTCHours(0)
        }
    }, cleanFindModifier);
};

questSchema.statics.findByQuestId = function (questId) {
    return this.findOne({
        id: questId
    }, cleanFindModifier);
};

var questModel = mongoose.model('Quest', questSchema);

module.exports = questModel;
