// deno-lint-ignore-file no-explicit-any
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const region = Deno.env.get('AWS_REGION') || 'us-east-1'
const endpoint = Deno.env.get('DYNAMO_ENDPOINT')
const tablePrefix = Deno.env.get('DYNAMO_TABLE_PREFIX') || 'dev_'

export const client = new DynamoDBClient({
  region,
  endpoint
})

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
})

export function tableNames () {
  return {
    quests: tablePrefix + 'Quests',
    progressions: tablePrefix + 'Progressions',
    activities: tablePrefix + 'Activities'
  }
}

export async function ensureTables () {
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

async function ensureTable (TableName: string, params: any) {
  try {
    await client.send(new DescribeTableCommand({ TableName }))
    return
  } catch (err: any) {
    if (!err || err.name !== 'ResourceNotFoundException') {
      if (err) throw err
    }
  }
  await client.send(new CreateTableCommand({ TableName, ...params }))
}


