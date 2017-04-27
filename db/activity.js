'use strict'
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const usernameRegexer = require('./usernameRegexer')

const activitySchema = mongoose.Schema({
  username: {type: String, index: true},
  quest: {type: ObjectId, ref: 'Quest'},
  action: String,
  date: {type: Date, default: Date.now}
})

activitySchema.statics.findForUser = function (username) {
  return this.find({
    username: usernameRegexer(username)
  }).limit(15).sort({
    date: 'descending'
  }).populate('quest')
}

activitySchema.statics.findRecent = function (username) {
  return this.find().limit(12).sort({
    date: 'descending'
  }).populate('quest')
}

activitySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const activityModel = mongoose.model('Activity', activitySchema)

module.exports = activityModel
