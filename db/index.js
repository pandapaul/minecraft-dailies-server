'use strict'
const dynamo = require('./dynamo')
const quest = require('./dynamoQuest')
const progression = require('./dynamoProgression')
const activity = require('./dynamoActivity')

function connect () {
  return dynamo.ensureTables()
}

module.exports = {
  connect: connect,
  quest: quest,
  activity: activity,
  progression: progression
}
