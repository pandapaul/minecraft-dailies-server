// deno-lint-ignore-file no-explicit-any
import { docClient, tableNames } from "./dynamo.ts"
import { PutCommand, QueryCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb"

export async function createActivity (activity: any) {
  const item = { ...activity }
  if (!item.date) item.date = new Date().toISOString()
  await docClient.send(new PutCommand({ TableName: tableNames().activities, Item: item }))
  return item
}

export async function findForUser (username: string) {
  const resp = await docClient.send(new QueryCommand({
    TableName: tableNames().activities,
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: { '#u': 'username' },
    ExpressionAttributeValues: { ':u': username },
    ScanIndexForward: false,
    Limit: 15
  }))
  return await populateQuests(resp.Items || [])
}

export async function findRecent () {
  const items: any[] = []
  let lastKey: any
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tableNames().activities, ExclusiveStartKey: lastKey }))
    if (resp.Items) items.push(...resp.Items)
    lastKey = (resp as any).LastEvaluatedKey
  } while (lastKey)
  items.sort((a, b) => (a.date < b.date ? 1 : -1))
  return await populateQuests(items.slice(0, 12))
}

async function populateQuests (activities: any[]) {
  const tn = tableNames()
  for (const a of activities) {
    if (a.quest) {
      const resp = await docClient.send(new GetCommand({ TableName: tn.quests, Key: { id: a.quest } }))
      a.quest = (resp as any).Item
    }
  }
  return activities
}


