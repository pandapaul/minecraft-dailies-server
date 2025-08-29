'use strict'
const { docClient, tableNames } = require('./dynamo')
const { PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb')

async function create (activity) {
  const item = Object.assign({}, activity)
  if (!item.date) item.date = new Date().toISOString()
  await docClient.send(new PutCommand({ TableName: tableNames().activities, Item: item }))
  return item
}

async function findForUser (username) {
  const resp = await docClient.send(new QueryCommand({
    TableName: tableNames().activities,
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: { '#u': 'username' },
    ExpressionAttributeValues: { ':u': username },
    ScanIndexForward: false,
    Limit: 15
  }))
  return populateQuests(resp.Items || [])
}

async function findRecent () {
  // Without a global index, scan and sort client-side for hobby scale
  const items = []
  let lastKey
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tableNames().activities, ExclusiveStartKey: lastKey }))
    if (resp.Items) items.push(...resp.Items)
    lastKey = resp.LastEvaluatedKey
  } while (lastKey)
  items.sort((a, b) => (a.date < b.date ? 1 : -1))
  return populateQuests(items.slice(0, 12))
}

async function populateQuests (activities) {
  const { GetCommand } = require('@aws-sdk/lib-dynamodb')
  const tn = tableNames()
  for (const a of activities) {
    if (a.quest) {
      const resp = await docClient.send(new GetCommand({ TableName: tn.quests, Key: { id: a.quest } }))
      a.quest = resp.Item
    }
  }
  return activities
}

module.exports = {
  create,
  findForUser,
  findRecent
}

