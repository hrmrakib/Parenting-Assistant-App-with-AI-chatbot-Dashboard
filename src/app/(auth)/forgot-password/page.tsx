"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthInput } from "@/components/ui/AuthInput";
import { useForgotPasswordMutation } from "@/redux/features/auth/authAPI";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await forgotPasswordMutation({ email }).unwrap();

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Failed to send forgot password request:", error);
    }
  };

  return (
    <AuthLayout>
      <div className='flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-[#0a192f] mb-8 text-center'>
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className='w-full space-y-8'>
          <AuthInput
            label='Enter your email'
            type='email'
            icon='mail'
            placeholder='example@gmail.com'
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            disabled={isLoading}
          />

          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-12 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
