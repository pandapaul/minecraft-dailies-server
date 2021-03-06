'use strict'
const mongoose = require('mongoose')

const questSchema = mongoose.Schema({
  name: String,
  status: String,
  progress: Number
}, {
  timestamps: true
})

questSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.createdAt
    delete ret.updatedAt
  }
})

questSchema.statics.findTodaysQuests = function () {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return this.find({
    createdAt: {
      $gte: today
    }
  })
}

questSchema.statics.findByQuestId = function (questId) {
  return this.findOne({
    _id: questId
  })
}

const questModel = mongoose.model('Quest', questSchema)

module.exports = questModel
