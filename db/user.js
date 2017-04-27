'use strict'
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = mongoose.Schema({
  username: {type: String, index: {unique: true}},
  quests: {
    inProgress: [{type: ObjectId, ref: 'Quest'}],
    complete: [{type: ObjectId, ref: 'Quest'}]
  }
}, {
  timestamps: true
})

userSchema.statics.findWithQuestsPopulated = function (username) {
  return this.findOne({
    username: username
  }).populate('quests.inProgress quests.complete')
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
