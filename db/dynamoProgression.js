'use strict'
const { docClient, tableNames } = require('./dynamo')
const { PutCommand, QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')

async function findForUserAndQuests (username, quests) {
  const ids = Array.isArray(quests) && quests.length && quests[0].id ? quests.map(q => q.id) : quests || []
  const progressions = []
  for (const questId of ids) {
    const item = await findForUserAndQuest(username, questId)
    if (item) progressions.push(item)
  }
  return progressions
}

async function findForUserAndQuest (username, questId) {
  const resp = await docClient.send(new GetCommand({ TableName: tableNames().progressions, Key: { username: username, quest: questId } }))
  return resp.Item
}

async function upsert (progression) {
  await docClient.send(new PutCommand({ TableName: tableNames().progressions, Item: progression }))
}

async function countAcceptedQuests (username) {
  return countByStatus('accepted', username)
}

async function countCompletions (username) {
  return countByStatus('complete', username)
}

async function countUsers () {
  const { ScanCommand } = require('@aws-sdk/lib-dynamodb')
  const seen = new Set()
  let lastKey
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tableNames().progressions, ExclusiveStartKey: lastKey, ProjectionExpression: 'username' }))
    if (resp.Items) resp.Items.forEach(i => seen.add(i.username))
    lastKey = resp.LastEvaluatedKey
  } while (lastKey)
  return seen.size
}

async function countByStatus (status, username) {
  const { QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb')
  if (username) {
    const resp = await docClient.send(new QueryCommand({
      TableName: tableNames().progressions,
      KeyConditionExpression: '#u = :u',
      FilterExpression: '#s = :s',
      ExpressionAttributeNames: { '#u': 'username', '#s': 'status' },
      ExpressionAttributeValues: { ':u': username, ':s': status }
    }))
    return (resp.Items || []).length
  }
  let lastKey
  let count = 0
  do {
    const resp = await docClient.send(new ScanCommand({
      TableName: tableNames().progressions,
      FilterExpression: '#s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': status },
      ExclusiveStartKey: lastKey
    }))
    count += (resp.Items || []).length
    lastKey = resp.LastEvaluatedKey
  } while (lastKey)
  return count
}

async function find (filter) {
  // Only used for accepted progressions with username; implement query by username + filter in memory
  const resp = await docClient.send(new QueryCommand({
    TableName: tableNames().progressions,
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: { '#u': 'username' },
    ExpressionAttributeValues: { ':u': filter.username }
  }))
  const items = resp.Items || []
  return items.filter(p => p.status === filter.status)
}

module.exports = {
  findForUserAndQuests,
  findForUserAndQuest,
  upsert,
  countAcceptedQuests,
  countCompletions,
  countUsers,
  find
}

