"use client"

import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/Card"
import { ArrowLeft, Bell } from "lucide-react"
import Link from "next/link"

const notifications = [
  {
    id: 1,
    title: "You have received $500 from John Doe",
    time: "Fri, 12:30pm",
    unread: true,
  },
  {
    id: 2,
    title: "New User registered.",
    time: "Fri, 12:30pm",
    unread: false,
  },
  {
    id: 3,
    title: "New User registered.",
    time: "Fri, 12:30pm",
    unread: false,
  },
  {
    id: 4,
    title: "New User registered.",
    time: "Fri, 12:30pm",
    unread: false,
  },
]

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8 min-h-[600px]">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-800" />
          </Link>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Notifications</h2>
        </div>

        <div className="space-y-4 max-w-4xl">
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <div 
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  notification.unread 
                    ? "bg-[#677761] text-white" 
                    : "bg-white text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                  notification.unread ? "border-white bg-white text-[#677761]" : "border-gray-200 bg-white text-gray-500"
                }`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <p className={`text-[15px] font-medium ${notification.unread ? "text-white" : "text-gray-800"}`}>
                    {notification.title}
                  </p>
                  <p className={`text-xs mt-1 ${notification.unread ? "text-white/80" : "text-gray-400"}`}>
                    {notification.time}
                  </p>
                </div>
              </div>
              
              {/* Add a divider between items, except after the unread item or the last item */}
              {index < notifications.length - 1 && !notification.unread && !notifications[index + 1].unread && (
                <hr className="border-gray-100" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
