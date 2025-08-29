// deno-lint-ignore-file no-explicit-any
import { docClient, tableNames } from "./dynamo.ts"
import { PutCommand, GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"

export async function findForUserAndQuests (username: string, quests: any[]) {
  const ids = Array.isArray(quests) && quests.length && quests[0].id ? quests.map(q => q.id) : quests || []
  const progressions: any[] = []
  for (const questId of ids) {
    const item = await findForUserAndQuest(username, questId)
    if (item) progressions.push(item)
  }
  return progressions
}

export async function findForUserAndQuest (username: string, questId: string) {
  const resp = await docClient.send(new GetCommand({ TableName: tableNames().progressions, Key: { username, quest: questId } }))
  return resp.Item
}

export async function upsert (progression: any) {
  await docClient.send(new PutCommand({ TableName: tableNames().progressions, Item: progression }))
}

export async function countAcceptedQuests (username?: string) {
  return countByStatus('accepted', username)
}

export async function countCompletions (username?: string) {
  return countByStatus('complete', username)
}

export async function countUsers () {
  const seen = new Set<string>()
  let lastKey: any
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tableNames().progressions, ExclusiveStartKey: lastKey, ProjectionExpression: 'username' }))
    if (resp.Items) resp.Items.forEach((i: any) => seen.add(i.username))
    lastKey = (resp as any).LastEvaluatedKey
  } while (lastKey)
  return seen.size
}

async function countByStatus (status: string, username?: string) {
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
  let lastKey: any
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
    lastKey = (resp as any).LastEvaluatedKey
  } while (lastKey)
  return count
}

export async function findAcceptedByUser (username: string) {
  const resp = await docClient.send(new QueryCommand({
    TableName: tableNames().progressions,
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: { '#u': 'username' },
    ExpressionAttributeValues: { ':u': username }
  }))
  return (resp.Items || []).filter((p: any) => p.status === 'accepted')
}


