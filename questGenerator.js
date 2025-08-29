'use strict'
const chance = require('chance').Chance()
const db = require('./db')
const quests = require('./questLoader').load()
const questsMap = {}

quests.forEach(function (quest) {
  questsMap[quest.name] = quest
})

async function generateDailies () {
  const dailies = chance.pickset(quests, 5)
  // Create quests in DB and attach generated ids
  await Promise.all(dailies.map(async function (daily, index) {
    const created = await db.quest.create({ name: daily.name })
    dailies[index].id = created.id
  }))
  return dailies
}

function inflateQuest (dbQuest) {
  let quest = {}
  if (dbQuest && dbQuest.name) {
    quest = JSON.parse(JSON.stringify(questsMap[dbQuest.name]))
  }
  quest.id = dbQuest.id
  quest.progress = dbQuest.progress
  quest.status = dbQuest.status
  return quest
}

function inflateQuests (dbQuests) {
  const quests = []
  dbQuests.forEach(function (dbQuest) {
    quests.push(inflateQuest(dbQuest))
  })
  return quests
}

module.exports = {
  generateDailies: generateDailies,
  inflateQuest: inflateQuest,
  inflateQuests: inflateQuests
}
