// deno-lint-ignore-file no-explicit-any
import { join } from "jsr:@std/path/join"
import { fromFileUrl } from "jsr:@std/path/from-file-url"

let cache: { list: any[]; map: Record<string, any> } | null = null

export async function loadAllQuests () {
  if (cache) return cache
  const repoRoot = fromFileUrl(new URL('../../..', import.meta.url))
  const dir = join(repoRoot, 'quests')
  const list: any[] = []
  const map: Record<string, any> = {}
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isFile && entry.name.endsWith('.json')) {
      const text = await Deno.readTextFile(join(dir, entry.name))
      const q = JSON.parse(text)
      list.push(q)
      if (q.name) map[q.name] = q
    }
  }
  cache = { list, map }
  return cache
}

export async function inflateQuestByName (name: string, dbQuest: any) {
  const { map } = await loadAllQuests()
  const base = map[name] || {}
  const inflated = { ...base }
  inflated.id = dbQuest.id
  inflated.progress = dbQuest.progress
  inflated.status = dbQuest.status
  return inflated
}

export async function inflateQuestsByNames (dbQuests: any[]) {
  const res: any[] = []
  for (const q of dbQuests) {
    res.push(await inflateQuestByName(q.name, q))
  }
  return res
}


