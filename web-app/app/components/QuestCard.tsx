// deno-lint-ignore-file no-explicit-any
import * as React from "react"
import { Card, CardHeader, CardContent } from "./ui/card.tsx"
// @ts-ignore - ESM resolution through Vite
import items from "minecraft-items"

export function QuestCard ({ quest }: { quest: any }) {
  const icon = pickIconForQuest(quest)
  const reward = quest?.reward?.quantity
  const rewardIcon = getRewardIcon(quest)
  return (
    <Card className="mc-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          {icon && <img src={icon} alt="" className="w-8 h-8 mt-1" />}
          <div className="min-w-0">
            <div className="text-lg font-semibold truncate">{quest.name}</div>
            {quest.description && <div className="text-sm opacity-80 truncate">{quest.description}</div>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-right text-sm opacity-80 flex items-center justify-end gap-2">
        {typeof reward === 'number' ? <>Rewards {reward}</> : null}
        {rewardIcon && <img src={rewardIcon} alt="" className="w-4 h-4" />}
      </CardContent>
    </Card>
  )
}

function pickIconForQuest (quest: any) {
  const name = (quest?.name || '').toLowerCase()
  if (name.includes('kill') || name.includes('wrath') || name.includes('fear') || name.includes('buggy')) return '/images/diamondSword.png'
  if (name.includes('mine') || name.includes('ore') || name.includes('redstone') || name.includes('gold') || name.includes('clean')) return '/images/ironOre.png'
  if (name.includes('gather') || name.includes('make') || name.includes('bake') || name.includes('smith')) return '/images/diamondPick.png'
  if (name.includes('fish') || name.includes('squid') || name.includes('bucket')) return '/images/bucket.png'
  return '/images/diamondPick.png'
}

function getRewardIcon (quest: any) {
  const id = quest?.reward?.type
  if (typeof id !== 'number') return null
  // minecraft-items exposes id-to-asset map; attempt lookup
  try {
    const entry = (items as any)[id] || (items as any).byId?.(id)
    if (!entry) return null
    // prefer 32px/64px icon path if available
    return entry.icon || entry.image || entry.src || null
  } catch (_e) {
    return null
  }
}


