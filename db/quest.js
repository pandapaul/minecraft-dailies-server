var mongoose = require('mongoose');
var cleanFindModifier = '-_id type target reward';

var questSchema = mongoose.Schema({
    type: String,
    status: String,
    progress: Number,
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

questSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
    }
});

questSchema.statics.findTodaysQuests = function () {
    return this.find({
        createdAt: {
            $gte: new Date().setUTCHours(0)
        }
    });
};

questSchema.statics.findByQuestId = function (questId) {
    return this.findOne({
        _id: questId
    });
};

var questModel = mongoose.model('Quest', questSchema);

module.exports = questModel;
