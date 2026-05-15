"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/loader/Spinner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetTermsQuery } from "@/redux/features/settings/settingsAPI";

export default function TermsConditionPage() {
  const { data: termsData, isLoading } = useGetTermsQuery({});

  const terms = termsData?.data;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <DashboardLayout>
      <div className='flex min-h-screen bg-gray-50'>
        <div className='flex-1 w-full'>
          <main className='w-full p-4 md:p-6'>
            <div className='max-w-3xl mx-auto'>
              <div className='mb-6 flex items-center justify-between'>
                <Link
                  href='/setting'
                  className='inline-flex items-center text-primary hover:text-[#8B9F86]'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  <span className='text-xl font-semibold'>
                    Terms & Condition
                  </span>
                </Link>

                <Link
                  href='/setting/terms-condition/edit'
                  className='inline-flex items-center text-primary hover:text-[#8B9F86] border border-[#8B9F86] rounded-md px-4 py-1.5'
                >
                  <span className='text-xl font-semibold'>Edit</span>
                </Link>
              </div>

              <div className='prose prose-sm max-w-none text-primary'>
                {terms?.content && !isLoading ? (
                  <div
                    className='prose prose-sm max-w-none'
                    dangerouslySetInnerHTML={{ __html: terms?.content }}
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
    </DashboardLayout>
  );
}
