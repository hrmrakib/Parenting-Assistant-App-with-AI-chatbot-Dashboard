import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "dark"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
    dark:
      "border-transparent bg-[#2C2C2C] text-white hover:bg-black",
    secondary:
      "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
    outline: "text-gray-950 border-gray-200",
    success:
      "border-transparent bg-[#2C2C2C] text-white", // Actually using dark for "Active" status in screenshot
    warning:
      "border-transparent bg-yellow-100 text-yellow-800",
    danger:
      "border-transparent bg-red-100 text-red-800",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
