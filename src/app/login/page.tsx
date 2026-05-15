/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthInput } from "@/components/ui/AuthInput";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { saveRefreshToken, saveTokens } from "@/service/authService";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const email = formData.email;
    const password = formData.password;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res?.ok) {
        // dispatch(userTrack());
        dispatch(
          setUser({
            user: data?.data?.user,
            token: data?.data?.access_token,
          }),
        );
        await saveTokens(data?.data?.access_token);
        await saveRefreshToken(data?.data?.refresh_token);
        localStorage.setItem("access_token", data?.data?.access_token);
        localStorage.setItem("refresh_token", data?.data?.refresh_token);
        router.push("/");
      } else {
        toast.error(data?.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
      // setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-[#0a192f] mb-8 text-center'>
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className='w-full space-y-6'>
          <AuthInput
            name='email'
            label='Enter your email'
            type='email'
            icon='mail'
            placeholder='pk3076889@gmail.co'
            required
            value={formData.email}
            onChange={handleInputChange}
          />

          <div className='space-y-2'>
            <AuthInput
              name='password'
              label='Create your password'
              type={showPassword ? "text" : "password"}
              icon='password'
              placeholder='••••••••••••'
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className='flex justify-end mt-1'>
              <Link
                href='/forgot-password'
                className='text-xs text-[#e3b4a8] hover:text-[#d28b81] transition-colors'
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type='submit'
            className='w-full h-12 mt-2 rounded-full bg-[#4b5e4a] text-white font-medium hover:bg-[#3a4939] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4b5e4a] focus:ring-offset-2'
          >
            Sign In
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
