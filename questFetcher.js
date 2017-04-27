'use strict'
const db = require('./db')
const questGenerator = require('./questGenerator')
const usernameRegexer = require('./db/usernameRegexer')
const modVersionParser = require('./modVersionParser')
const mongoose = require('mongoose')

function fetchQuestInventory (username, modVersion) {
  const questInventoryMap = {}
  const usernameRegex = usernameRegexer(username)
  modVersion = modVersionParser.fromString(modVersion)

  return fetchDailies()
        .then(setDailiesStatusAvailable)
        .then(fetchDailiesProgressions)
        .then(removeCompleteDailies)
        .then(fetchAcceptedProgressions)
        .then(addAcceptedQuests)
        .then(buildInflatedInventory)

  function setDailiesStatusAvailable (dailies) {
    dailies.forEach(function (quest) {
      quest.status = 'available'
      questInventoryMap[quest.id] = quest
    })
    return dailies
  }

  function fetchDailiesProgressions (dailies) {
    return db.progression.findForUserAndQuests(username, dailies)
  }

  function removeCompleteDailies (dailyProgressions) {
    dailyProgressions.forEach(function (progression) {
      if (progression.status === 'complete') {
        delete questInventoryMap[progression.quest]
      }
    })
  }

  function fetchAcceptedProgressions () {
    return db.progression.find({
      username: usernameRegex,
      status: 'accepted'
    }).populate('quest')
  }

  function addAcceptedQuests (acceptedProgressions) {
    acceptedProgressions.forEach(function (progression) {
      progression.quest.status = progression.status
      progression.quest.progress = progression.progress
      questInventoryMap[progression.quest.id] = progression.quest
    })
  }

  function buildInflatedInventory () {
    const questInventory = []
    for (let quest in questInventoryMap) {
      if (!questInventoryMap.hasOwnProperty(quest)) {
        continue
      }
      let inflatedQuest = questGenerator.inflateQuest(questInventoryMap[quest])
      if (inflatedQuest.minimumModBuild && (modVersion.modBuild < inflatedQuest.minimumModBuild)) {
        inflatedQuest.id = mongoose.Types.ObjectId()
        inflatedQuest.progress = 0
        inflatedQuest.status = 'available'
        inflatedQuest.description = 'Please update mod. This quest requires build ' + inflatedQuest.minimumModBuild + ' or higher.'
        inflatedQuest.target = {
          type: 0,
          quantity: 100
        }
        inflatedQuest.reward = {
          type: 3,
          quantity: 1
        }
      }
      questInventory.push(inflatedQuest)
    }
    return questInventory
  }
}

function fetchDailies () {
  return db.quest.findTodaysQuests()
        .then(function (quests) {
          if (quests && quests.length) {
            return questGenerator.inflateQuests(quests)
          } else {
            return questGenerator.generateDailies()
          }
        })
}

function fetchQuestById (questId) {
  return db.quest.findByQuestId(questId)
        .then(function (quest) {
          return questGenerator.inflateQuest(quest)
        })
}

module.exports = {
  fetchDailies: fetchDailies,
  fetchQuestById: fetchQuestById,
  fetchQuestInventory: fetchQuestInventory
}
