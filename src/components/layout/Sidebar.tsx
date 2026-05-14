"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, BookOpen, LogOut, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content", href: "/content", icon: BookOpen },
  { name: "User", href: "/users", icon: Users },
  { name: "Settings", href: "#", icon: Settings },
]

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#8fa38b] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 lg:hidden p-2 text-white/80 hover:text-white transition-colors rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Logo Placeholder */}
          <div className="w-24 h-24 mb-4 rounded-full bg-[#f9f8f4] flex items-center justify-center shadow-sm relative">
            <div className="absolute inset-2 border-2 border-[#8fa38b] rounded-full opacity-30 flex items-center justify-center">
              <span className="text-[#8fa38b] font-bold text-xs text-center leading-tight">TRUSTED<br/>NEST</span>
            </div>
            {/* Main icon shape */}
            <div className="text-[#8fa38b]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-4 rounded-lg px-4 py-3 text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-[#8fa38b]"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-[#8fa38b]" : "text-white/80 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mb-4">
          <Link
            href="#"
            className="group flex items-center gap-4 rounded-lg px-4 py-3 text-[15px] font-medium text-white/90 hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 text-white/80 group-hover:text-white" />
            Log Out
          </Link>
        </div>
      </div>
    </>
  )
}
