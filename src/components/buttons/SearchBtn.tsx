"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import useAppStore from '@/store/app';
import { useRouter } from 'next/navigation';

export default function SearchBtn() {
  const { location, categories, numberOfLocations } = useAppStore();
  const isDisabled = !location || !categories.length || !numberOfLocations;
  const router = useRouter();

  const handleSearch = () => {
    const encodedLocation = encodeURIComponent(location);
    const encodedCategories = encodeURIComponent(categories.join(','));
    router.push(`/results?location=${encodedLocation}&categories=${encodedCategories}&numberOfLocations=${numberOfLocations}`);
  };

  return (
    <Button
      className={`flex px-3 py-4 justify-center items-center bg-[#dadbff] self-stretch rounded-[20px] shadow-md w-full ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c0c1ff]'}`}
      onClick={handleSearch}
      disabled={isDisabled}
      aria-disabled={isDisabled}
    >
      <Image src={require('@/app/svgs/ai-sparkles.svg')} alt="AI Sparkles" width={20} height={20} className="mr-2" />
      <span className="text-[#5857f2]">Generate</span>
    </Button>
  );
}