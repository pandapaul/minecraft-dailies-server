'use strict'
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')

const region = process.env.AWS_REGION || 'us-east-1'
const endpoint = process.env.DYNAMO_ENDPOINT
const tablePrefix = process.env.DYNAMO_TABLE_PREFIX || 'minecraft_dailies_'

const client = new DynamoDBClient({
  region: region,
  endpoint: endpoint
})

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
})

function tableNames () {
  return {
    quests: tablePrefix + 'Quests',
    progressions: tablePrefix + 'Progressions',
    activities: tablePrefix + 'Activities'
  }
}

async function ensureTables () {
  const tables = tableNames()
  await ensureTable(tables.quests, {
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  })

  await ensureTable(tables.progressions, {
    AttributeDefinitions: [
      { AttributeName: 'username', AttributeType: 'S' },
      { AttributeName: 'quest', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'username', KeyType: 'HASH' },
      { AttributeName: 'quest', KeyType: 'RANGE' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  })

  await ensureTable(tables.activities, {
    AttributeDefinitions: [
      { AttributeName: 'username', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'username', KeyType: 'HASH' },
      { AttributeName: 'date', KeyType: 'RANGE' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  })
}

async function ensureTable (tableName, params) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }))
    return
  } catch (err) {
    if (err && err.name !== 'ResourceNotFoundException') {
      throw err
    }
  }
  await client.send(new CreateTableCommand(Object.assign({ TableName: tableName }, params)))
}

module.exports = {
  client,
  docClient,
  tableNames,
  ensureTables
}

