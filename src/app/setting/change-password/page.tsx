/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdatePasswordMutation } from "@/redux/features/settings/settingsAPI";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "", // Added field
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      // Matching your required JSON structure
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const res = await updatePassword(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Password updated successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        router.push("/setting");
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to update password";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='flex-1 w-full'>
        <main className='w-full p-4 md:p-6'>
          <div className='max-w-3xl mx-auto'>
            <div className='mb-6'>
              <Link
                href='/setting'
                className='inline-flex items-center text-primary hover:text-teal-700'
              >
                <ArrowLeft className='mr-2 h-6 w-6' />
                <span className='text-2xl text-primary font-semibold'>
                  Change Password
                </span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <Alert variant='destructive' className='bg-red-50'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Current Password Field */}
              <div className='space-y-2'>
                <Label
                  htmlFor='currentPassword'
                  style={{ color: "#17CA2A" }}
                  className='text-lg font-medium text-primary!'
                >
                  Current Password
                </Label>
                <div className='relative'>
                  <Input
                    id='currentPassword'
                    name='currentPassword'
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder='Enter current password'
                    className='text-lg font-medium text-primary!'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className='space-y-2'>
                <Label
                  htmlFor='newPassword'
                  style={{ color: "#17CA2A" }}
                  className='text-lg font-medium text-primary!'
                >
                  New Password
                </Label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    name='newPassword'
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder='Enter new password'
                    className='text-lg font-medium text-primary!'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className='space-y-2'>
                <Label
                  htmlFor='confirmPassword'
                  style={{ color: "#17CA2A" }}
                  className='text-lg font-medium text-primary!'
                >
                  Confirm New Password
                </Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='Re-type new password'
                    className='text-lg font-medium text-primary!'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className='pt-2'>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='bg-primary hover:bg-[#5a0921] text-lg font-medium text-white px-8'
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
