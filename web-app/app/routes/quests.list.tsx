import * as React from "react"
import type { LoaderFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
import { QuestCard } from "../components/QuestCard.tsx"
import { join } from "jsr:@std/path/join"
import { fromFileUrl } from "jsr:@std/path/from-file-url"

export async function loader(_args: LoaderFunctionArgs) {
  const repoRoot = fromFileUrl(new URL('../../..', import.meta.url))
  const dir = join(repoRoot, 'quests')
  const quests: any[] = []
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isFile && entry.name.endsWith('.json')) {
      const text = await Deno.readTextFile(join(dir, entry.name))
      quests.push(JSON.parse(text))
    }
  }
  return Response.json(quests)
}

export default function QuestListRoute() {
  const quests = useLoaderData() as any[]
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="mc-heading text-center">All Quests</h1>
      <p className="text-center mb-6 opacity-80">List of all {quests.length} quests that form the pool of possible dailies.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quests.map((q, i) => (<QuestCard key={i} quest={q} />))}
      </div>
    </div>
  )
}


