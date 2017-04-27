'use strict'
const fs = require('fs')
const questsDirectory = 'quests'
const quests = []

function load () {
  if (quests.length) {
    return quests
  }
  const filenames = fs.readdirSync(questsDirectory)
  filenames.forEach(function (filename) {
    const fileContents = fs.readFileSync(questsDirectory + '/' + filename, 'utf-8')
    const quest = JSON.parse(fileContents)
    quests.push(quest)
  })
  return quests
}

module.exports = {
  load: load
}
