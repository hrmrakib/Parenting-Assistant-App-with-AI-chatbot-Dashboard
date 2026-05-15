"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import {
  BookOpen,
  Check,
  UploadCloud,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const libraryData = [
  {
    id: 1,
    title: "Prenatal Yoga Basics",
    type: "Video",
    segment: "Week 12",
    created: "2025-10-01",
  },
  {
    id: 2,
    title: "Prenatal Yoga Basics",
    type: "Video",
    segment: "Week 12",
    created: "2025-10-01",
  },
  {
    id: 3,
    title: "Prenatal Yoga Basics",
    type: "Video",
    segment: "Week 12",
    created: "2025-10-01",
  },
  {
    id: 4,
    title: "Prenatal Yoga Basics",
    type: "Video",
    segment: "Week 12",
    created: "2025-10-01",
  },
];

export default function ContentPage() {
  return (
    <DashboardLayout>
      <div className='flex flex-col gap-6'>
        <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
          <div className='flex items-start gap-3 mb-8'>
            <BookOpen className='h-6 w-6 text-gray-800' />
            <div>
              <h2 className='text-xl font-bold text-gray-900 tracking-tight mb-1'>
                Content Management
              </h2>
              <p className='text-sm text-gray-500'>
                Upload, Edit, Delete and organize content by week or age group
              </p>
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='text-lg font-bold text-gray-900 tracking-tight'>
              Add New Content
            </h3>
            <p className='text-sm text-gray-500'>Text, photo or video</p>
          </div>

          <form className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Title
                </label>
                <input
                  type='text'
                  placeholder='e.g. pelvic floor basic'
                  className='w-full h-11 rounded-full border border-gray-200 bg-gray-50/50 px-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Type
                </label>
                <div className='relative'>
                  <select className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'>
                    <option>Article</option>
                    <option>Video</option>
                    <option>Image</option>
                  </select>
                  <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Category
                </label>
                <div className='relative'>
                  <select className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'>
                    <option>Baby</option>
                    <option>Mother</option>
                    <option>Toddler</option>
                  </select>
                  <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-900'>
                  Month
                </label>
                <div className='relative'>
                  <select className='w-full h-11 appearance-none rounded-full border border-gray-200 bg-gray-50/50 px-4 pr-10 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b]'>
                    <option>2 Months</option>
                    <option>3 Months</option>
                    <option>4 Months</option>
                  </select>
                  <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-900'>
                Description/Notes
              </label>
              <textarea
                placeholder='e.g. pelvic floor basic'
                className='w-full h-32 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-sm outline-none transition-all focus:border-[#8fa38b] focus:ring-1 focus:ring-[#8fa38b] resize-none'
              />
            </div>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <Button
                variant='default'
                className='bg-[#1C1C1C] hover:bg-black rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium'
              >
                <Check className='h-4 w-4' />
                Save Content
              </Button>
              <Button
                variant='outline'
                className='rounded-lg h-10 px-5 flex items-center gap-2 text-sm font-medium bg-white text-gray-700 border-gray-200'
              >
                <UploadCloud className='h-4 w-4' />
                Upload Media
              </Button>
            </div>
          </form>
        </Card>

        {/* Library Section */}
        <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8'>
          <div className='mb-6'>
            <h3 className='text-lg font-bold text-gray-900 tracking-tight'>
              Library
            </h3>
            <p className='text-sm text-gray-500'>Manage existing items</p>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-[14px]'>
              <thead>
                <tr className='border-b-2 border-gray-100 text-gray-900 font-bold'>
                  <th className='pb-3 px-4 font-semibold'>Title</th>
                  <th className='pb-3 px-4 font-semibold text-center'>Type</th>
                  <th className='pb-3 px-4 font-semibold text-center'>
                    Segment
                  </th>
                  <th className='pb-3 px-4 font-semibold text-center'>
                    Created
                  </th>
                  <th className='pb-3 px-4 font-semibold text-center'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 text-gray-600'>
                {libraryData.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-gray-50/50 transition-colors'
                  >
                    <td className='py-4 px-4 font-medium text-gray-800'>
                      {item.title}
                    </td>
                    <td className='py-4 px-4 text-center'>{item.type}</td>
                    <td className='py-4 px-4 text-center'>{item.segment}</td>
                    <td className='py-4 px-4 text-center'>{item.created}</td>
                    <td className='py-4 px-4'>
                      <div className='flex items-center justify-center gap-3'>
                        <button className='text-gray-800 hover:text-gray-600 transition-colors'>
                          <Edit className='h-4 w-4' />
                        </button>
                        <button className='text-[#d28b81] hover:text-red-500 transition-colors'>
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
