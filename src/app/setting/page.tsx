"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
// import { RoleRedirect } from "@/components/auth/RoleRedirect";

export default function SettingsPage() {
  const settingsLinks = [
    { title: "Personal Information", href: "/setting/personal-information" },
    { title: "Change Password", href: "/setting/change-password" },
    { title: "Terms & Condition", href: "/setting/terms-condition" },
    { title: "Privacy Policy", href: "/setting/privacy-policy" },
    { title: "About Us", href: "/setting/about" },
  ];

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <DashboardLayout>
        <div className='flex min-h-screen bg-transparent px-6'>
          <div className='flex-1 w-full'>
            <main className='w-full'>
              <div className='max-w-3xl bg-white p-6 rounded-2xl'>
                <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
                  Settings
                </h1>
                <div className='border-b border-gray-200 mb-6'></div>

                <div className='space-y-4'>
                  {settingsLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className='flex items-center justify-between px-3 py-3 text-[#0D1A3E] border border-[#DFE0E4] rounded-md  transition-colors'
                    >
                      <span className='text-primary text-base'>
                        {link.title}
                      </span>
                      <ChevronRight className='h-5 w-5 text-gray-400' />
                    </Link>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </DashboardLayout>
    </RoleRedirect>
  );
}
