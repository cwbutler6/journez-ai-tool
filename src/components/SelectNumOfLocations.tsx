"use client";

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Image from 'next/image'
import useAppStore from '@/store/app';

export default function SelectNumOfLocations() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { numberOfLocations, updateNumberOfLocations } = useAppStore();
  const selectLocation = (num: number) => {
    updateNumberOfLocations(num);
    setIsOpen(false);
  }
  const ButtonOption = ({ num, placeholder }: { num: number; placeholder?: string }) => (
    <button
      onClick={() => selectLocation(num)}
      className={`flex px-[24px] py-[16px] ${numberOfLocations === num ? 'bg-[#7f7f7f]' : 'bg-[#f7f7f7]'}`}
    >
      <span>{placeholder ?? `${num} locations`}</span>
    </button>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex px-[12px] py-[18px] justify-center items-center self-stretch bg-[#f8f8f8] shadow-[0_1px_10px_0_rgba(0,0,0,0.10)] rounded-[20px] mb-[30px] w-full">
          <span className='text-[#8f8f8f]'>
            {(numberOfLocations === 0) ? 'Select the amount of locations per category' : `${numberOfLocations} locations`}
          </span>
          <Image src={require('@/app/svgs/chevron-down.svg')} alt="Arrow Down" width={24} height={24} />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-[327px] flex flex-col rounded-[12px] bg-[#f7f7f7] shadow-[4px_4px_16px_0_rgba(0,0,0,0.10)]">
        <ButtonOption num={1} />
        <ButtonOption num={2} />
        <ButtonOption num={3} />
        <ButtonOption num={4} />
        <ButtonOption num={5} />
      </PopoverContent>
    </Popover>
  )
}