"use client";
import dynamic from "next/dynamic";

const ContentPage = dynamic(
  () => import("../../components/content/ContentPageClient"),
  {
    ssr: false,
    loading: () => (
      <div className='flex items-center justify-center min-h-screen'>
        <span className='text-sm text-gray-400'>Loading…</span>
      </div>
    ),
  },
);

export default function Page() {
  return <ContentPage />;
}
