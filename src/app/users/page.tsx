"use client"

import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ChevronDown } from "lucide-react"

const usersData = [
  { id: 1, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
  { id: 2, name: "Aisha Rahman", email: "aisha@email.com", plan: "Free", status: "Active", segment: "Week 07" },
  { id: 3, name: "Aisha Rahman", email: "aisha@email.com", plan: "Free", status: "Active", segment: "Week 12" },
  { id: 4, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
  { id: 5, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
  { id: 6, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
  { id: 7, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
  { id: 8, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
  { id: 9, name: "Aisha Rahman", email: "aisha@email.com", plan: "Premium", status: "Active", segment: "Week 12" },
]

export default function UsersPage() {
  return (
    <DashboardLayout>
      <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">All User</h2>
          <p className="text-sm text-gray-500">View users, manage subscriptions, approve gift requests</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or email"
              className="h-9 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]"
            />
          </div>
          <div className="w-full sm:w-48 relative">
            <select className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-gray-50/50 px-3 pr-8 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="w-full sm:w-48 relative">
            <select className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-gray-50/50 px-3 pr-8 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]">
              <option value="segment">Segment</option>
              <option value="week12">Week 12</option>
              <option value="week07">Week 07</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b-2 border-gray-100 text-gray-900 font-bold">
                <th className="pb-3 px-4 font-semibold">Name</th>
                <th className="pb-3 px-4 font-semibold">Email</th>
                <th className="pb-3 px-4 font-semibold text-center">Plan</th>
                <th className="pb-3 px-4 font-semibold text-center">Status</th>
                <th className="pb-3 px-4 font-semibold text-center">Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {usersData.map((user, idx) => (
                <tr key={`${user.id}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-800">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4 text-center">{user.plan}</td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant="dark" className="px-4 py-1 font-medium bg-[#2C2C2C] hover:bg-[#1A1A1A]">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-center">{user.segment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
