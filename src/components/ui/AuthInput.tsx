"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail } from "lucide-react"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: "mail" | "password"
}

export function AuthInput({ label, icon, type, className, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = icon === "password" || type === "password"
  const currentType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="space-y-2 w-full">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <div className="relative flex items-center group">
        <input
          type={currentType}
          className={`h-12 w-full rounded-full border border-gray-200 bg-white px-5 pr-12 text-sm text-gray-900 placeholder-[#e3b4a8] outline-none transition-all focus:border-[#e3b4a8] focus:ring-1 focus:ring-[#e3b4a8] ${className || ""}`}
          {...props}
        />
        
        {icon === "mail" && (
          <div className="absolute right-4 text-gray-400">
            <Mail className="h-5 w-5" />
          </div>
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
