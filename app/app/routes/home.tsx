// deno-lint-ignore-file no-explicit-any
import type { Route } from "./+types/home.ts"
import { ensureTables, tableNames, docClient } from "../lib/dynamo.ts"
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from "node:crypto"
import { join } from "jsr:@std/path/join"
import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { findRecent } from "../lib/activity.ts"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Minecraft Dailies" },
    { name: "description", content: "Today\'s quests and recent activity" }
  ]
}

export async function loader() {
  await ensureTables()
  const tn = tableNames()
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()

  const items: any[] = []
  let lastKey: any
  do {
    const resp = await docClient.send(new ScanCommand({ TableName: tn.quests, ExclusiveStartKey: lastKey }))
    if (resp.Items) items.push(...resp.Items)
    lastKey = (resp as any).LastEvaluatedKey
  } while (lastKey)

  let todays = items.filter(q => q.createdAt >= start)
  if (todays.length === 0) {
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

  const activities = await findRecent()
  return { quests: todays, activities }
}

export default function Home({ loaderData }: Route.ComponentProps<typeof loader>) {
  const { quests, activities } = loaderData as { quests: any[]; activities: any[] }
  return (
    <div>
      <h1>Today\'s Quests</h1>
      <ul>
        {quests.map((q) => (
          <li key={q.id}>{q.name}</li>
        ))}
      </ul>
      <h2 style={{ marginTop: 24 }}>Recent Activity</h2>
      <ul>
        {activities.map((a) => (
          <li key={`${a.username}-${a.date}-${a.action}`}>{a.username} {a.action} {a.quest?.name}</li>
        ))}
      </ul>
    </div>
  )
}
