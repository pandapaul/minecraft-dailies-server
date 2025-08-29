import * as React from "react"
import type { LoaderFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
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
    <div>
      <h1>All Quests</h1>
      <ul>
        {quests.map((q, i) => (
          <li key={i}>{q.name}</li>
        ))}
      </ul>
    </div>
  )
}


