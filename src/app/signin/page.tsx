"use client"

import React from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { AuthInput } from "@/components/ui/AuthInput"

export default function SignInPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in
    window.location.href = "/" // Redirect to dashboard for demo purposes
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#0a192f] mb-8 text-center">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <AuthInput
            label="Enter your email"
            type="email"
            icon="mail"
            placeholder="pk3076889@gmail.co"
            required
          />

          <div className="space-y-2">
            <AuthInput
              label="Create your password"
              type="password"
              icon="password"
              placeholder="••••••••••••"
              required
            />
            <div className="flex justify-end mt-1">
              <Link 
                href="/forgot-password" 
                className="text-xs text-[#e3b4a8] hover:text-[#d28b81] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
