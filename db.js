var mongoose = require('mongoose');

function connect() {
    return new Promise(function (resolve, reject) {
        var db = mongoose.connection;
        db.on('error', reject);
        db.once('open', resolve);
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');
    });
}

module.exports = {
    connect: connect
};
