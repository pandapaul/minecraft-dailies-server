import * as React from "react"
import { Link } from "react-router"

export function Navbar () {
  return (
    <header className="mc-header sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="mc-title">Minecraft Dailies</Link>
        <nav className="flex gap-5 text-emerald-900">
          <a href="https://www.minecraftdailies.com" className="hover:underline">Download</a>
          <Link to="/quests" className="hover:underline">Quests</Link>
          <a href="https://github.com/pandapaul/minecraft-dailies-server/tree/master/static/docs" className="hover:underline">API</a>
          <a href="https://github.com/pandapaul/minecraft-dailies-server" className="hover:underline">Source</a>
        </nav>
      </div>
    </header>
  )
}


