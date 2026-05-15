"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGetCommunityGuidelinesQuery } from "@/redux/features/settings/settingsAPI";
import Spinner from "@/components/loading/Spinner";

export default function CommunityGuidelines() {
  const { data: termsData, isLoading } = useGetCommunityGuidelinesQuery({});

  const terms = termsData?.data;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='flex-1 w-full'>
        <main className='w-full p-4 md:p-6'>
          <div className='max-w-3xl mx-auto'>
            <div className='mb-6 flex items-center justify-between'>
              <Link
                href='/setting'
                className='inline-flex items-center text-primary hover:text-teal-700'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                <span className='text-xl font-semibold'>
                  Community Guidelines
                </span>
              </Link>

              <Link
                href='/setting/community-guidelines/edit'
                className='inline-flex items-center text-primary hover:text-teal-700 border border-[#760C2A] rounded-md px-4 py-1.5'
              >
                <span className='text-xl font-semibold'>Edit</span>
              </Link>
            </div>

            <div className='prose prose-sm max-w-none text-primary'>
              {terms[0]?.description && !isLoading ? (
                <div
                  className='prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{ __html: terms[0]?.description }}
                />
              ) : (
                !isLoading && <p>No terms and conditions found</p>
              )}

              {isLoading && <p> Loading...</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
