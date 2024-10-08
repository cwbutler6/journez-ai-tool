"use client";

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import useAppStore from '@/store/app';
import { useRouter } from 'next/navigation';

export default function NewSearchBtn() {
  const { resetSearch } = useAppStore();
  const router = useRouter();
  const onClick = () => {
    resetSearch();
    router.push('/');
  }
  return (
    <Button className='bg-[#DADBFF] rounded-[20px] shadow-[0_1px_10px_1px_rgba(0,0,0,0.10)] w-[222px]' onClick={onClick}>
      <div className='flex flex-row items-center'>
        <Image src={require('@/app/svgs/ai-sparkles.svg')} alt="AI Sparkles" width={20} height={20} className="mr-[8px]" />
        <span className="text-[#5857f2]">New Search</span>
      </div>
    </Button>
  )
}
