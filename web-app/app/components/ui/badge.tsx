import * as React from "react"

export function Badge({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center rounded bg-emerald-600/10 px-2 py-0.5 text-xs font-medium text-emerald-700 ${className}`} {...props} />
  )
}


