// deno-lint-ignore-file no-explicit-any
import * as React from "react"
import type { LoaderFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
import { countCompletions, countUsers } from "../lib/progression.ts"
import { ensureTables } from "../lib/dynamo.ts"

export async function loader(_args: LoaderFunctionArgs) {
  await ensureTables()
  const completions = await countCompletions()
  const users = await countUsers()
  return Response.json({ completions, users })
}

export default function StatsRoute() {
  const data = useLoaderData() as { completions: number; users: number }
  return (
    <div>
      <h1>Stats</h1>
      <div>Completions: {data.completions}</div>
      <div>Users: {data.users}</div>
    </div>
  )
}


