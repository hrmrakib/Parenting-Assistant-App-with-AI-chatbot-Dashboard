"use client"

import React from "react"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { AuthInput } from "@/components/ui/AuthInput"

export default function ResetPasswordPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset
    window.location.href = "/signin" // Redirect to sign in after demo reset
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#0a192f] mb-8 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <AuthInput
            label="Your new password"
            type="password"
            icon="password"
            placeholder="••••••••••••"
            required
          />

          <AuthInput
            label="Your Confirm password"
            type="password"
            icon="password"
            placeholder="••••••••••••"
            required
          />

          <button
            type="submit"
            className="w-full h-12 mt-4 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2"
          >
            Save
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
