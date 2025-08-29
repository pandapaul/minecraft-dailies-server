// deno-lint-ignore-file no-explicit-any
import type { Route } from "./+types/home.ts"
import { ensureTables, tableNames, docClient } from "../lib/dynamo.ts"
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from "node:crypto"
import { join } from "jsr:@std/path/join"
import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { findRecent } from "../lib/activity.ts"
import { Card, CardHeader, CardContent } from "../components/ui/card.tsx"
import { Input } from "../components/ui/input.tsx"
import { Button } from "../components/ui/button.tsx"
import { Form } from "react-router"

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
      todays.push({ id, ...quest })
    }
  }

  const activities = await findRecent()
  return { quests: todays, activities }
}

export default function Home({ loaderData }: Route.ComponentProps<typeof loader>) {
  const { quests, activities } = loaderData as { quests: any[]; activities: any[] }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Form action="/" method="get" onSubmit={(e) => {
        const form = e.currentTarget as HTMLFormElement
        const data = new FormData(form)
        const username = String(data.get('username') || '').trim()
        if (username) {
          e.preventDefault()
          window.location.href = `/${encodeURIComponent(username)}/quests`
        }
      }} className="mb-6">
        <div className="flex gap-2">
          <Input name="username" placeholder="Find a player" />
          <Button type="submit">Go</Button>
        </div>
      </Form>

      <h1 className="mc-heading">Today\'s Quests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((q) => (
          <QuestCard key={q.id} quest={q} />
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Activity</h2>
      <ul className="space-y-2">
        {activities.map((a) => (
          <li key={`${a.username}-${a.date}-${a.action}`} className="rounded border border-emerald-800/20 bg-emerald-50/50 p-3">
            <span className="font-semibold">{a.username}</span> {a.action} <span className="italic">{a.quest?.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuestCard ({ quest }: { quest: any }) {
  const icon = pickIconForQuest(quest)
  return (
    <Card className="shadow-sm mc-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          {icon && <img src={icon} alt="" className="w-8 h-8 mt-1" />}
          <div>
            <div className="text-lg font-semibold">{quest.name}</div>
            {quest.description && <div className="text-sm opacity-80">{quest.description}</div>}
          </div>
        </div>
      </CardHeader>
      {quest.reward && (
        <CardContent>
          <div className="text-right text-sm opacity-80">Rewards {quest.reward.quantity}</div>
        </CardContent>
      )}
    </Card>
  )
}

function pickIconForQuest (quest: any) {
  const name = (quest?.name || '').toLowerCase()
  if (name.includes('kill') || name.includes('wrath') || name.includes('fear')) return '/images/diamondSword.png'
  if (name.includes('mine') || name.includes('ore') || name.includes('redstone') || name.includes('gold')) return '/images/ironOre.png'
  if (name.includes('gather') || name.includes('make') || name.includes('bake') || name.includes('smith')) return '/images/diamondPick.png'
  if (name.includes('fish') || name.includes('squid') || name.includes('bucket')) return '/images/bucket.png'
  return '/images/diamondPick.png'
}
