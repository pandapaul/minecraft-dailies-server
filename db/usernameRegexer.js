var escaper = require('escape-string-regexp');

module.exports = function (username) {
    return new RegExp('^' + escaper(username) + '$','i');
};
