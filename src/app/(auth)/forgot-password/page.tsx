"use client"

import React from "react"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { AuthInput } from "@/components/ui/AuthInput"

export default function ForgotPasswordPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password
    window.location.href = "/verify-email" // Redirect to verify for demo flow
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#0a192f] mb-8 text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <AuthInput
            label="Enter your email"
            type="email"
            icon="mail"
            placeholder="pk3076889@gmail.co"
            required
          />

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
