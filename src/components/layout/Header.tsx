"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { getImageUrl } from "@/utils/imagePath";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className='sticky top-0 z-30 flex h-22 w-full items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-8 m-4 mt-4 mr-6 rounded-xl shadow-sm'>
      <div className='flex items-center gap-4'>
        <button
          onClick={onMenuClick}
          className='lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-md focus:outline-none'
          aria-label='Open sidebar'
        >
          <Menu className='h-6 w-6' />
        </button>

        <div className='flex flex-col'>
          <h2 className='text-xl font-bold text-gray-900 leading-tight tracking-tight'>
            Welcome, {user?.name || "N/A"}
          </h2>
          <span className='text-sm text-gray-500'>Have a nice day</span>
        </div>
      </div>

      <div className='flex items-center gap-6'>
        {/* <Link
          href='/notifications'
          className='relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full focus:outline-none'
        >
          <Bell className='h-5 w-5' />
          <span className='absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white'>
            12
          </span>
        </Link> */}

        <Link
          href='/setting/personal-information'
          className='flex items-center gap-3 cursor-pointer'
        >
          <div className='h-10 w-10 rounded-full overflow-hidden bg-gray-200'>
            <Image
              src={getImageUrl(user?.avatar)}
              width={50}
              height={50}
              alt={user?.name || "Photo"}
            />
          </div>
          <div className='hidden sm:flex items-center gap-2'>
            <span className='text-sm font-semibold text-gray-900'>
              {user?.name || "N/A"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
