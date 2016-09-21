'use strict';
const escaper = require('escape-string-regexp');

module.exports = function (username) {
    try {
        return new RegExp('^' + escaper(username) + '$','i');
    } catch (err) {
        throw 'Invalid username format.';
    }
};
