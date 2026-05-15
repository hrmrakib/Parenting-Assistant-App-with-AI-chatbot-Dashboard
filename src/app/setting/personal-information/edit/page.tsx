"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming you use sonner or similar for feedback
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/settings/settingsAPI";

export default function PersonalInformationEditPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState<File | string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: profileResponse, isLoading } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Sync state with API data
  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        bio: user.bio || "",
      });
      // Set existing image URL
      setProfileImage(user.image || "");
    }
  }, [profileResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file); // Store file object for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data as per your required format
    const updateData = {
      name: formData.name,
      address: formData.address,
      bio: formData.bio,
    };

    const formDataToSubmit = new FormData();
    // Append the JSON data as a string in the 'data' field
    formDataToSubmit.append("data", JSON.stringify(updateData));

    // Append image if a new file was selected
    if (profileImage instanceof File) {
      formDataToSubmit.append("image", profileImage);
    }

    try {
      const res = await updateProfile(formDataToSubmit).unwrap();
      if (res.success) {
        toast.success("Profile updated successfully!");
        router.push("/setting/personal-information");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update Error:", error);
    }
  };

  // Determine which image to show
  const displayImageSource =
    imagePreview ||
    (typeof profileImage === "string" && profileImage
      ? profileImage
      : "/admin.jpg");

  if (isLoading) return <div className='p-10 text-center'>Loading...</div>;

  return (
    <div className='flex min-h-screen bg-transparent'>
      <div className='flex-1 w-full'>
        <main className='bg-transparent w-full p-4 md:p-6'>
          <div className='mx-auto'>
            <div className='mb-6 text-primary'>
              <Link
                href='/setting/personal-information'
                className='inline-flex items-center hover:text-teal-700'
              >
                <ArrowLeft className='mr-2 h-6 w-6' />
                <span className='text-2xl font-semibold'>
                  Personal Information Edit
                </span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex flex-col md:flex-row gap-8'>
                {/* Profile Image Section */}
                <div className='w-full md:w-64 flex flex-col items-center border border-gray-600 rounded-md p-6 bg-white/50'>
                  <div
                    className='relative mb-4 cursor-pointer group'
                    onClick={handleImageClick}
                  >
                    <div className='w-32 h-32 rounded-full overflow-hidden relative border-2 border-primary'>
                      <Image
                        src={displayImageSource}
                        alt='Profile'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform'>
                      <Camera className='h-4 w-4' />
                    </div>
                    <input
                      type='file'
                      ref={fileInputRef}
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  </div>
                  <span className='text-sm text-gray-600 font-medium'>
                    Profile Photo
                  </span>
                  <span className='font-bold text-primary'>
                    {formData.name || "User"}
                  </span>
                </div>

                {/* Form Fields Section */}
                <div className='flex-1 space-y-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='name'
                      className='text-lg font-medium text-primary'
                    >
                      Name
                    </Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='w-full text-lg border-gray-400 text-gray-900'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='text-lg font-medium text-primary'
                    >
                      Email
                    </Label>
                    <Input
                      id='email'
                      disabled
                      value={formData.email}
                      className='w-full text-lg bg-gray-100 cursor-not-allowed border-gray-400 text-gray-900'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='address'
                      className='text-lg font-medium text-primary'
                    >
                      Address
                    </Label>
                    <Input
                      id='address'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      className='w-full text-lg border-gray-400 text-gray-900'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='bio'
                      className='text-lg font-medium text-primary'
                    >
                      Bio
                    </Label>
                    <Input
                      id='bio'
                      name='bio'
                      value={formData.bio}
                      onChange={handleChange}
                      className='w-full text-lg border-gray-400 text-gray-900'
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end pt-4'>
                <Button
                  type='submit'
                  disabled={isUpdating}
                  className='bg-primary hover:bg-teal-700 text-white px-10 py-6 text-lg rounded-full'
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
