var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var quests = require('./routes/quests');
var users = require('./routes/users');
var db = require('./db');

routes();
connectToDb()
    .then(listen)
    .catch(logDbConnectionError);

function routes() {
    app.use(express.static('static'));
    app.use(bodyParser.json());
    app.use('/quests', quests);
    app.use('/users', users);
    app.use(function(err, req, res, next) {
        if (err.stack) {
            console.error(err.stack);
            res.status(500).send('Unfortunately an error has occurred.');
        } else {
            res.status(400).json({
                error: err
            });
        }
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

function logDbConnectionError(error) {
    console.log('Database Connection Error:', error);
}
