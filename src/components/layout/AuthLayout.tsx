"use client";

import React from "react";
import Image from "next/image";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8'>
      {/* Background Image Container */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={`/auth-bg.jpg`}
          alt='Pregnant woman relaxing'
          fill
          unoptimized
          className='object-cover object-center'
          priority
        />
        {/* Dark overlay to match screenshot readability */}
        <div className='absolute inset-0 bg-black/40 backdrop-blur-[2px]' />
      </div>

      {/* Auth Card Container */}
      <div className='relative z-10 w-full max-w-[540px] animate-in fade-in zoom-in duration-500'>
        <div className='bg-[#fcfaf6] rounded-[24px] shadow-2xl p-8 sm:p-12 w-full'>
          {children}
        </div>
      </div>
    </div>
  );
}
