var express = require('express');
var app = express();
var quests = require('./routes/quests');
var db = require('./db');

routes();
connectToDb()
    .then(listen)
    .catch(logError);

function routes() {
    app.use('/quests', quests);
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
