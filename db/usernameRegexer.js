module.exports = function (username) {
    return new RegExp('^' + username + '$','i');
};
