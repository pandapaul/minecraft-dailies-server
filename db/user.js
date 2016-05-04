var mongoose = require('mongoose');
var cleanFindModifier = '-_id id';

var userSchema = mongoose.Schema({
    username: {type: String, index: {unique: true}}
}, {
    timestamps: true
});

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;
