var yggdrasil = require('yggdrasil');

function authenticate(req) {
    if (!req.accessToken) {
        return Promise.reject();
    }
    return new Promise(function (resolve,reject) {
        yggdrasil.validate(req.accessToken, function (isValid, err) {
            if (err) {
                reject(err);
            } else if(!isValid) {
                reject(isValid);
            } else {
                resolve(isValid);
            }
        });
    });
}

module.exports = authenticate;
