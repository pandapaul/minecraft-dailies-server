'use strict'
const { docClient, tableNames } = require('./dynamo')
const { PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')
const { randomUUID } = require('crypto')

function nowIso () {
  return new Date().toISOString()
}

async function findTodaysQuests () {
  // With Dynamo we don't have a direct createdAt index; for hobby scale, scan substitute
  // But avoid full scan: store today's generated quests and reuse for the day
  // We approximate by fetching quests created today using client-side filter
  const all = await listAll()
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  return all.filter(q => q.createdAt >= start)
}

async function listAll () {
  // Minimal scan via query impossible without GSI; fallback to paginate scan
  const { ScanCommand } = require('@aws-sdk/lib-dynamodb')
  const items = []
  let lastKey
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tableNames().quests, ExclusiveStartKey: lastKey }))
    if (resp.Items) items.push(...resp.Items)
    lastKey = resp.LastEvaluatedKey
  } while (lastKey)
  return items
}

async function findByQuestId (id) {
  const resp = await docClient.send(new GetCommand({ TableName: tableNames().quests, Key: { id } }))
  return resp.Item
}

async function create (quest) {
  const id = quest.id || randomUUID()
  const item = Object.assign({ id: id, createdAt: nowIso() }, quest)
  await docClient.send(new PutCommand({ TableName: tableNames().quests, Item: item }))
  return item
}

module.exports = {
  findTodaysQuests,
  findByQuestId,
  create
}

