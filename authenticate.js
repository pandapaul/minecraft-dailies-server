var yggdrasil = require('yggdrasil')({});

function authenticate(req) {
    if (!req.body.accessToken) {
        return Promise.reject('No accessToken provided.');
    }
    if (!req.body.username && !req.params.username) {
        return Promise.reject('No username provided.');
    }
    return new Promise(function (resolve,reject) {
        yggdrasil.validate(req.body.accessToken, function (isValid, err) {
            if (err) {
                reject(err);
            } else if(!isValid) {
                reject('Provided accessToken is not valid');
            } else {
                resolve(isValid);
            }
        });
    });
}

function freeForAll() {
    return Promise.resolve(true);
}

module.exports = freeForAll;
