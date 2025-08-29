import { LoaderFunctionArgs, useLoaderData, Link } from "react-router"
import { tableNames, docClient, ensureTables } from "../lib/dynamo.ts"
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from "node:crypto"
import { join } from "jsr:@std/path/join"
import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { Card, CardHeader, CardContent } from "../components/ui/card.tsx"
import { Badge } from "../components/ui/badge.tsx"

export async function loader(_args: LoaderFunctionArgs) {
  await ensureTables()
  // Emulate Node fetchDailies: if no quests created today, create 5 from static list
  const tn = tableNames()
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()

  const items: any[] = []
  let lastKey: any
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tn.quests, ExclusiveStartKey: lastKey }))
    if (resp.Items) items.push(...resp.Items)
    lastKey = resp.LastEvaluatedKey
  } while (lastKey)

  let todays = items.filter(q => q.createdAt >= start)
  if (todays.length === 0) {
    // generate 5 random dailies from quests/ directory JSON files
    const repoRoot = fromFileUrl(new URL('../../..', import.meta.url))
    const dir = join(repoRoot, 'quests')
    const names: string[] = []
    for await (const entry of Deno.readDir(dir)) {
      if (entry.isFile && entry.name.endsWith('.json')) names.push(entry.name)
    }
    const pick = (arr: string[], n: number) => arr.sort(() => Math.random() - 0.5).slice(0, n)
    const chosen = pick(names, 5)
    todays = []
    for (const file of chosen) {
      const text = await Deno.readTextFile(join(dir, file))
      const quest = JSON.parse(text)
      const id = randomUUID()
      const createdAt = new Date().toISOString()
      await docClient.send(new PutCommand({ TableName: tn.quests, Item: { id, name: quest.name, createdAt } }))
      todays.push({ id, name: quest.name })
    }
  }
  return Response.json(todays)
}

export default function QuestsRoute() {
  const quests = useLoaderData() as any[]
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="mc-heading">Today\'s Quests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((q) => (
          <Card key={q.id} className="shadow-sm mc-card">
            <CardHeader>
              <div className="text-lg font-semibold">{q.name}</div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm opacity-80">{q.description}</div>
              <Badge>Daily</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-right">
        <Link to="/quests/list" className="text-emerald-700 underline">See all quests</Link>
      </div>
    </div>
  )
}


