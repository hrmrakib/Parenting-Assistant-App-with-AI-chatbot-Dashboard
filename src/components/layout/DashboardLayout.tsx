"use client"

import React, { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-[#f9f8f4] overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* We place the header inside the main area, with a bit of padding to match the floating style */}
        <div className="px-4 pt-4 sm:px-6">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="p-4 sm:p-6 mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
