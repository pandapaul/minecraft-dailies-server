var express = require('express');
var app = express();
var quests = require('./routes/quests');

routes();
listen();

function routes() {
    app.use('/quests', quests);
}

function listen() {
	var listenPort = process.env.PORT || 5000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}
