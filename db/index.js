'use strict';
const mongoose = require('mongoose');
const quest = require('./quest');
const user = require('./user');
const activity = require('./activity');
const progression = require('./progression');

function connect() {
    return new Promise(function (resolve, reject) {
        const db = mongoose.connection;
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
