// deno-lint-ignore-file no-explicit-any
import * as React from "react"
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router"
import { useLoaderData, Form } from "react-router"
import { Card, CardHeader, CardContent } from "../components/ui/card.tsx"
import { Button } from "../components/ui/button.tsx"
import { tableNames, docClient, ensureTables } from "../lib/dynamo.ts"
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import { inflateQuestByName } from "../lib/questLoader.ts"
import * as progression from "../lib/progression.ts"
import { createActivity } from "../lib/activity.ts"

export async function loader({ params }: LoaderFunctionArgs) {
  await ensureTables()
  const username = params.username!
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
  const dailyProgressions = await progression.findForUserAndQuests(username, todays)
  todays = todays.filter(q => !dailyProgressions.find(p => p.quest === q.id && p.status === 'complete'))

  const accepted = await progression.findAcceptedByUser(username)
  const acceptedInflated: any[] = []
  for (const p of accepted) {
    const resp = await docClient.send(new GetCommand({ TableName: tn.quests, Key: { id: p.quest } }))
    const q = (resp as any).Item
    if (q) {
      const inf = await inflateQuestByName(q.name, { ...q, status: p.status, progress: p.progress })
      acceptedInflated.push(inf)
    }
  }

  const availableInflated: any[] = []
  for (const q of todays) {
    availableInflated.push(await inflateQuestByName(q.name, { ...q, status: 'available' }))
  }
  const inventory = [...acceptedInflated, ...availableInflated]
  return Response.json({ username, inventory })
}

export async function action({ params, request }: ActionFunctionArgs) {
  await ensureTables()
  const username = params.username!
  const url = new URL(request.url)
  const method = url.searchParams.get('_action') || (await request.formData()).get('_action') as string
  const questId = url.searchParams.get('questId') || (await request.formData()).get('questId') as string
  if (!method || !questId) return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })

  if (method === 'accept') {
    const count = await progression.countAcceptedQuests(username)
    if (count >= 10) return new Response(JSON.stringify({ error: 'You\'ve already accepted 10 quests.' }), { status: 400 })
    await progression.upsert({ username, quest: questId, status: 'accepted' })
    await createActivity({ username, quest: questId, action: 'accept' })
    return new Response(null, { status: 303, headers: { Location: `/${encodeURIComponent(username)}/quests` } })
  }

  if (method === 'progress') {
    const progress = Number(url.searchParams.get('progress') || (await request.formData()).get('progress'))
    await progression.upsert({ username, quest: questId, progress })
    return new Response(null, { status: 303, headers: { Location: `/${encodeURIComponent(username)}/quests` } })
  }

  if (method === 'complete') {
    await progression.upsert({ username, quest: questId, status: 'complete' })
    await createActivity({ username, quest: questId, action: 'complete' })
    return new Response(null, { status: 303, headers: { Location: `/${encodeURIComponent(username)}/quests` } })
  }

  if (method === 'abandon') {
    await progression.upsert({ username, quest: questId })
    await createActivity({ username, quest: questId, action: 'abandon' })
    return new Response(null, { status: 303, headers: { Location: `/${encodeURIComponent(username)}/quests` } })
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 })
}

export default function UserQuestsRoute() {
  const data = useLoaderData() as { username: string; inventory: any[] }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="mc-heading">{data.username}\'s Quests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.inventory.map((q) => (
          <Card key={q.id} className="shadow-sm mc-card">
            <CardHeader>
              <div className="text-lg font-semibold">{q.name}</div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <div className="text-sm opacity-80">{q.status || 'available'}</div>
              <div className="flex gap-2">
                {(!q.status || q.status === 'available') && (
                  <Form method="post">
                    <input type="hidden" name="_action" value="accept" />
                    <input type="hidden" name="questId" value={q.id} />
                    <Button type="submit">Accept</Button>
                  </Form>
                )}
                {q.status === 'accepted' && (
                  <>
                    <Form method="post">
                      <input type="hidden" name="_action" value="complete" />
                      <input type="hidden" name="questId" value={q.id} />
                      <Button type="submit" variant="outline">Complete</Button>
                    </Form>
                    <Form method="post">
                      <input type="hidden" name="_action" value="abandon" />
                      <input type="hidden" name="questId" value={q.id} />
                      <Button type="submit" variant="ghost">Abandon</Button>
                    </Form>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

 


