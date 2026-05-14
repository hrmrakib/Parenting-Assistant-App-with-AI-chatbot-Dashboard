"use client"

import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, LineChart, BookOpen } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, Line } from "recharts"

const revenueData = [
  { name: "Aug", value: 1200 },
  { name: "Sep", value: 1600 },
  { name: "Oct", value: 1800 },
  { name: "Nov", value: 2600 },
  { name: "Dec", value: 3300 },
]

const trackerData = [
  { name: "Aug", value: 3300 },
  { name: "Sep", value: 2600 },
  { name: "Oct", value: 1800 },
  { name: "Nov", value: 1600 },
  { name: "Dec", value: 1200 },
]

const engagementData = [
  { name: "Aug", sessions: 1200, users: 2000 },
  { name: "Sep", sessions: 1500, users: 2200 },
  { name: "Oct", sessions: 1800, users: 2500 },
  { name: "Nov", sessions: 2100, users: 3000 },
]

export default function OverviewPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#e5eee3] flex items-center justify-center text-[#8fa38b]">
                <Users className="h-6 w-6 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Total Users</span>
                <span className="text-3xl font-bold text-gray-900">2,143</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#f4e6e3] flex items-center justify-center text-[#d28b81]">
                <LineChart className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Active Subs</span>
                <span className="text-3xl font-bold text-gray-900">1,284</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#e5eee3] flex items-center justify-center text-[#8fa38b]">
                <Users className="h-6 w-6 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Content Items</span>
                <span className="text-3xl font-bold text-gray-900">326</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#f4e6e3] flex items-center justify-center text-[#d28b81]">
                <LineChart className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Revenue Today</span>
                <span className="text-3xl font-bold text-gray-900">40,689</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] pt-6 pb-2">
            <div className="px-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Subscription Revenue</h3>
              <p className="text-xs text-gray-500 mt-1">Last 4 months</p>
            </div>
            <div className="h-[250px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={{stroke: '#e5e7eb'}} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} ticks={[500, 1000, 1500, 3000, 4500]} />
                  <Bar dataKey="value" fill="#1A1A1A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] pt-6 pb-2">
            <div className="px-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Tracker usage</h3>
              <p className="text-xs text-gray-500 mt-1">Feature adoption</p>
            </div>
            <div className="h-[250px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={{stroke: '#e5e7eb'}} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} ticks={[500, 1000, 1500, 3000, 4500]} />
                  <Bar dataKey="value" fill="#1A1A1A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom Line Chart */}
        <Card className="rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-6 pb-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Engagement</h3>
            <p className="text-xs text-gray-500 mt-1">Sessions and active users (last 4 months)</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={{stroke: '#111827'}} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} ticks={[1000, 1500, 3000, 4500]} />
                <Line type="linear" dataKey="users" stroke="#687e61" strokeWidth={2} dot={false} />
                <Line type="linear" dataKey="sessions" stroke="#8fa38b" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  )
}
