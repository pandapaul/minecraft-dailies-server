var express = require('express');
var app = express();
var quests = require('./routes/quests');
var users = require('./routes/users');
var db = require('./db');

routes();
connectToDb()
    .then(listen)
    .catch(logError);

function routes() {
    app.use(express.static('static'));
    app.use('/quests', quests);
    app.use('/users', users);
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Unfortunately an error has occurred.');
    });
}

function connectToDb() {
    return db.connect();
}

function listen() {
	var listenPort = process.env.PORT || 5000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}

function logError(error) {
    console.log('Error:', error);
}
