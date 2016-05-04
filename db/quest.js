var mongoose = require('mongoose');

var questSchema = mongoose.Schema({
    id: {type: String, index: {unique: true}},
    type: String,
    target: {
        type: Number,
        quantity: Number
    },
    reward: {
        type: Number,
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
    });
};

var questModel = mongoose.model('Quest', questSchema);

module.exports = questModel;
