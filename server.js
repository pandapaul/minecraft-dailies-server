'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const quests = require('./routes/quests');
const users = require('./routes/users');
const db = require('./db');
const questLoader = require('./questLoader');
const stats = require('./routes/stats');

routes();
connectToDb()
    .then(listen)
    .catch(logDbConnectionError);

function routes() {
    app.use(express.static('static'));
    app.use(bodyParser.json());
    app.use('/quests', quests);
    app.use('/:username', users);
    app.use('/stats', stats);
    app.use(basicErrorHandling);
}

function connectToDb() {
    return db.connect();
}

function listen() {
	const listenPort = process.env.PORT || 5000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}

function logDbConnectionError(error) {
    console.log('Database Connection Error:', error);
}

function basicErrorHandling (err, req, res, next) {
    if (err.stack) {
        console.error(err.stack);
        res.status(500).json({
            error: 'Unfortunately an error has occurred.'
        });
    } else {
        res.status(400).json({
            error: err
        });
    }
}
