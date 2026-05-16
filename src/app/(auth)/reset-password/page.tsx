/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthInput } from "@/components/ui/AuthInput";
import { useResetPasswordMutation } from "@/redux/features/auth/authAPI";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  // Retrieve the token from localStorage safely on client side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate that the passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // 2. Safely fall back if token isn't found in localStorage
    if (!token) {
      toast.error(
        "Session token missing or expired. Please request a new link.",
      );
      return;
    }

    try {
      // 3. Send payload structured matching your requirements
      await resetPasswordMutation({
        token,
        password,
      }).unwrap();

      toast.success("Password reset successfully!");

      // Optional: Clean up localStorage token after usage
      localStorage.removeItem("token");

      // Redirect smoothly using next router instead of window.location
      router.push("/signin");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className='flex flex-col items-center w-full max-w-[400px] mx-auto'>
        <h1 className='text-3xl font-bold text-[#0a192f] mb-8 text-center'>
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className='w-full space-y-6'>
          <AuthInput
            label='Your new password'
            type='password'
            icon='password'
            placeholder='••••••••••••'
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            disabled={isLoading}
          />

          <AuthInput
            label='Your Confirm password'
            type='password'
            icon='password'
            placeholder='••••••••••••'
            required
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            disabled={isLoading}
          />

          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-12 mt-4 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
