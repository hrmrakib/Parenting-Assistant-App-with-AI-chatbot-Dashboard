"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { logout } from "@/service/authService";
import { setUser } from "@/redux/features/auth/authSlice";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content", href: "/content", icon: BookOpen },
  { name: "User", href: "/users", icon: Users },
  { name: "Settings", href: "/setting", icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    // Perform actual application auth cleanup execution blocks here:
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    await logout();
    // setUser({ user: null, token: null });

    setShowLogoutModal(false);
    setIsOpen(false); // Close sidebar on mobile views

    // Redirect user back to authentication root
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#8B9F86] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className='flex flex-col items-center justify-center pt-8 pb-6 px-6 relative'>
          <button
            onClick={() => setIsOpen(false)}
            className='absolute top-4 right-4 lg:hidden p-2 text-white/80 hover:text-white transition-colors rounded-md'
          >
            <X className='h-5 w-5' />
          </button>

          {/* Logo Placeholder */}
          <div className='w-24 h-16 mb-4 bg-transparent flex items-center justify-center relative'>
            <Image src={"/logo.png"} width={200} height={200} alt='logo' />
          </div>
        </div>

        <nav className='flex-1 space-y-2 p-4'>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-4 rounded-lg px-4 py-3 text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-[#8B9F86]"
                    : "text-white/90 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-[#8B9F86]"
                      : "text-white/80 group-hover:text-white",
                  )}
                  aria-hidden='true'
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className='p-4 mb-4'>
          <button
            type='button'
            onClick={() => setShowLogoutModal(true)}
            className='w-full group flex items-center gap-4 rounded-lg px-4 py-3 text-[15px] font-medium text-white/90 hover:bg-red-500/10 transition-all duration-200 text-left'
          >
            <LogOut className='h-5 w-5 text-white/80 group-hover:text-white' />
            Log Out
          </button>
        </div>
      </div>

      {/* 3. Warning Confirmation Modal Portal Shell */}
      {showLogoutModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
          {/* Backdrop blur cover overlay block */}
          <div
            className='fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity'
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Card dialog layout container */}
          <div className='relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-gray-900 transform transition-all animate-in fade-in zoom-in-95 duration-200'>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>
              Confirm Logout
            </h3>
            <p className='text-sm text-gray-500 mb-6'>
              Are you sure you want to log out of your account? You will need to
              sign back in to access your dashboard.
            </p>

            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={() => setShowLogoutModal(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleLogoutConfirm}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
