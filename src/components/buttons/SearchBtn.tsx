"use client";

import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import useAppStore from '@/store/app';
import { useRouter } from 'next/navigation';

export default function SearchBtn() {
  const { location, categories, numberOfLocations } = useAppStore();
  const isDisabled = !location || !categories.length || !numberOfLocations;
  const router = useRouter();

  return (
    <Button
      className="flex px-[12px] py-[18px] justify-center items-center bg-[#dadbff] self-stretch rounded-[20px] shadow-[0_1px_10px_0_rgba(0,0,0,0.10)] w-full"
      onClick={() => router.push(`/results?location=${location}&categories=${categories.join(',')}&numberOfLocations=${numberOfLocations}`)}
      disabled={isDisabled}
    >
      <Image src={require('@/app/svgs/ai-sparkles.svg')} alt="AI Sparkles" width={20} height={20} className="mr-[8px]" />
      <span className="text-[#5857f2]">Generate</span>
    </Button>
  )
}
