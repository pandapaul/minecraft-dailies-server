var mongoose = require('mongoose');
var quest = require('./quest');
var user = require('./user');
var activity = require('./activity');
var progression = require('./progression');

function connect() {
    return new Promise(function (resolve, reject) {
        var db = mongoose.connection;
        db.on('error', reject);
        db.once('open', resolve);
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');
    });
}

module.exports = {
    connect: connect,
    quest: quest,
    user: user,
    activity: activity,
    progression: progression
};
