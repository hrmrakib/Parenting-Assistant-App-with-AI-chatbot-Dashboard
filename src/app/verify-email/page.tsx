"use client"

import React, { useState, useRef } from "react"
import { AuthLayout } from "@/components/layout/AuthLayout"

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["1", "1", "1", "1", "1", "1"]) // Pre-filled with 1s like screenshot
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1)
    }
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if there's a value
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle verification
    window.location.href = "/reset-password" // Demo flow
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold text-[#0a192f] mb-8 text-center">
          Verify Email
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex justify-between w-full max-w-[400px] mb-8 gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => {
                  if (el) inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-400 bg-transparent text-center text-lg font-medium text-gray-900 outline-none transition-all focus:border-[#e3b4a8] focus:ring-1 focus:ring-[#e3b4a8]"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2 mb-4"
          >
            Verify
          </button>

          <p className="text-xs text-gray-900 font-medium text-center">
            Don't get the code? <button type="button" className="text-[#d28b81] hover:text-[#c4776c] hover:underline">Resend</button>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
