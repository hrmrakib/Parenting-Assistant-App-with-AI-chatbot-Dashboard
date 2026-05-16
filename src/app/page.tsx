"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, LineChart, BookOpen } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import { useGetOverviewQuery } from "@/redux/features/overview/overviewAPI";

export default function OverviewPage() {
  const { data: overviewData } = useGetOverviewQuery({});

  const apiData = overviewData?.data;

  const trackerData = apiData?.trackerUsageGraph?.byMonth ?? [];

  const engagementData = (apiData?.userEngagementGraph ?? []).map(
    (item: { month: string; activeSessions: number }) => ({
      name: item.month,
      sessions: item.activeSessions,

      users: 0,
    }),
  );

  const trackerByTypeData = apiData?.trackerUsageGraph?.byType
    ? Object.entries(apiData.trackerUsageGraph.byType).map(([type, count]) => ({
        name: type.charAt(0) + type.slice(1).toLowerCase(),
        value: count as number,
      }))
    : [];

  return (
    <DashboardLayout>
      <div className='flex flex-col gap-6'>
        {/* Top Metrics Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Total Users */}
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='w-14 h-14 rounded-xl bg-[#e5eee3] flex items-center justify-center text-[#8fa38b]'>
                <Users className='h-6 w-6 fill-current' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-500'>
                  Total Users
                </span>
                <span className='text-3xl font-bold text-gray-900'>
                  {apiData?.totalUser?.toLocaleString() ?? "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Active Subs — no direct API field; kept as static or can be wired later */}
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='w-14 h-14 rounded-xl bg-[#f4e6e3] flex items-center justify-center text-[#d28b81]'>
                <LineChart className='h-6 w-6' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-500'>
                  Active Sessions
                </span>
                <span className='text-3xl font-bold text-gray-900'>
                  {apiData?.userEngagementGraph?.reduce(
                    (sum: number, item: { activeSessions: number }) =>
                      sum + item.activeSessions,
                    0,
                  ) ?? "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Content Items */}
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='w-14 h-14 rounded-xl bg-[#e5eee3] flex items-center justify-center text-[#8fa38b]'>
                <BookOpen className='h-6 w-6' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-500'>
                  Content Items
                </span>
                <span className='text-3xl font-bold text-gray-900'>
                  {apiData?.totalContent?.toLocaleString() ?? "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Tracker Usages */}
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='w-14 h-14 rounded-xl bg-[#f4e6e3] flex items-center justify-center text-[#d28b81]'>
                <LineChart className='h-6 w-6' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-500'>
                  Total Tracker Usage
                </span>
                <span className='text-3xl font-bold text-gray-900'>
                  {apiData?.trackerUsageGraph?.byType
                    ? Object.values(
                        apiData.trackerUsageGraph.byType as Record<
                          string,
                          number
                        >,
                      )
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Tracker Usage by Month */}
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] pt-6 pb-2'>
            <div className='px-6 mb-4'>
              <h3 className='text-lg font-bold text-gray-900'>Tracker Usage</h3>
              <p className='text-xs text-gray-500 mt-1'>Monthly usage</p>
            </div>
            <div className='h-62.5 w-full px-2'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={trackerData.map(
                    (item: { month: string; usage: number }) => ({
                      name: item.month,
                      value: item.usage,
                    }),
                  )}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={40}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e5e7eb'
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#111827" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#111827" }}
                  />
                  <Bar dataKey='value' fill='#1A1A1A' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Tracker Usage by Type */}
          <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] pt-6 pb-2'>
            <div className='px-6 mb-4'>
              <h3 className='text-lg font-bold text-gray-900'>
                Tracker by Type
              </h3>
              <p className='text-xs text-gray-500 mt-1'>Feature adoption</p>
            </div>
            <div className='h-62.5 w-full px-2'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={trackerByTypeData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e5e7eb'
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#111827" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#111827" }}
                  />
                  <Bar dataKey='value' fill='#1A1A1A' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom Line Chart — User Engagement */}
        <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-6 pb-2'>
          <div className='mb-6'>
            <h3 className='text-xl font-bold text-gray-900'>User Engagement</h3>
            <p className='text-xs text-gray-500 mt-1'>
              Active sessions per month
            </p>
          </div>
          <div className='h-75 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <RechartsLineChart
                data={engagementData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={true}
                  horizontal={true}
                  stroke='#e5e7eb'
                />
                <XAxis
                  dataKey='name'
                  axisLine={{ stroke: "#111827" }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#111827" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#111827" }}
                />
                <Line
                  type='linear'
                  dataKey='sessions'
                  stroke='#687e61'
                  strokeWidth={2}
                  dot={false}
                  name='Active Sessions'
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
