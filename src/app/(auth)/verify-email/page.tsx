"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import {
  useVerifyForgetPasswordOtpVerifyMutation,
  useForgotPasswordMutation,
} from "@/redux/features/auth/authAPI";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyForgetPasswordOtpVerifyMutation, { isLoading: isVerifying }] =
    useVerifyForgetPasswordOtpVerifyMutation();

  const [forgotPasswordMutation, { isLoading: isResending }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 1. Added explicit paste handler logic
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Filter down to numbers only
    const numericData = pastedData.replace(/\D/g, "").slice(0, 6);

    if (numericData.length === 0) return;

    const newOtp = [...otp];
    // Populate individual array blocks based on parsed string indexes
    for (let i = 0; i < 6; i++) {
      newOtp[i] = numericData[i] || "";
    }
    setOtp(newOtp);

    // Focus on the next logical cell based on character inputs
    const targetIndex = Math.min(numericData.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length < 6 || !email) {
      toast.error("Missing OTP or Email parameters");
      return;
    }

    try {
      const res = await verifyForgetPasswordOtpVerifyMutation({
        email,
        otp: otpString,
      }).unwrap();

      if (res?.success) {
        localStorage.setItem("reset_token", res?.data?.reset_token);
      }

      toast.success("Email verified successfully!");
      router.push(`/reset-password`);
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid verification code");
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;

    try {
      await forgotPasswordMutation({ email }).unwrap();

      toast.success("OTP resent successfully!");
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error("Failed to resend code. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className='flex flex-col items-center w-full'>
        <h1 className='text-3xl font-bold text-[#0a192f] mb-2 text-center'>
          Verify Email
        </h1>
        {email && (
          <p className='text-sm text-gray-500 mb-8 text-center break-all max-w-[320px]'>
            Code sent to{" "}
            <span className='font-semibold text-gray-700'>{email}</span>
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className='w-full flex flex-col items-center'
        >
          <div className='flex justify-between w-full max-w-100 mb-8 gap-2 sm:gap-3'>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type='text'
                inputMode='numeric'
                autoComplete='one-time-code'
                maxLength={1}
                value={digit}
                disabled={isVerifying || isResending}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste} // 2. Attached the event listener to the elements
                className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-400 bg-transparent text-center text-lg font-medium text-gray-900 outline-none transition-all focus:border-[#e3b4a8] focus:ring-1 focus:ring-[#e3b4a8] disabled:opacity-60'
              />
            ))}
          </div>

          <button
            type='submit'
            disabled={isVerifying || isResending || otp.join("").length < 6}
            className='w-full h-12 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2 mb-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isVerifying ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>

          <p className='text-xs text-gray-900 font-medium text-center min-h-4'>
            Don&apos;t get the code?{" "}
            {timeLeft > 0 ? (
              <span className='text-gray-400 font-normal ml-1'>
                Resend in{" "}
                <span className='font-semibold text-gray-600'>{timeLeft}s</span>
              </span>
            ) : (
              <button
                type='button'
                disabled={isVerifying || isResending}
                onClick={handleResend}
                className='text-[#d28b81] hover:text-[#c4776c] hover:underline disabled:opacity-50 ml-1 inline-flex items-center gap-1'
              >
                {isResending && <Loader2 className='h-3 w-3 animate-spin' />}
                Resend
              </button>
            )}
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmail />
    </Suspense>
  );
}
