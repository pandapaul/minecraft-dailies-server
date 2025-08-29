// deno-lint-ignore-file no-explicit-any
import * as React from "react"
import type { LoaderFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
import { findRecent } from "../lib/activity.ts"
import { ensureTables } from "../lib/dynamo.ts"

export async function loader(_args: LoaderFunctionArgs) {
  await ensureTables()
  const activities = await findRecent()
  return Response.json(activities)
}

export default function ActivitiesRoute() {
  const activities = useLoaderData() as any[]
  return (
    <div>
      <h1>Recent Activities</h1>
      <ul>
        {activities.map((a) => (
          <li key={`${a.username}-${a.date}-${a.action}`}>{a.username} {a.action} {a.quest?.name}</li>
        ))}
      </ul>
    </div>
  )
}


