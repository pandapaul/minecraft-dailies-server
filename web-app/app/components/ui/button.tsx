import * as React from "react"

type Variant = "default" | "outline" | "ghost" | "link"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2"
    const variants: Record<Variant, string> = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700",
      outline: "border border-emerald-600 text-emerald-700 hover:bg-emerald-50",
      ghost: "hover:bg-emerald-50 text-emerald-700",
      link: "text-emerald-700 underline-offset-4 hover:underline"
    }
    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />
    )
  }
)

Button.displayName = "Button"


