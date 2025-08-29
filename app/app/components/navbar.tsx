import * as React from "react"
import { Link } from "react-router"

export function Navbar () {
  return (
    <header className="mc-header sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="mc-title">Minecraft Dailies</Link>
        <nav className="flex gap-4 text-emerald-800">
          <Link to="/quests" className="hover:underline">Quests</Link>
          <Link to="/activities" className="hover:underline">Activity</Link>
          <Link to="/stats" className="hover:underline">Stats</Link>
        </nav>
      </div>
    </header>
  )
}


