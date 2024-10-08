"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import useAppStore from '@/store/app';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

export default function SelectCategory() {
  const { categories, updateCategories} = useAppStore();
  const selectCategory = (category: string) => {
    return () => {
      if (categories.includes(category)) {
        updateCategories(categories.filter((c) => c !== category));
      } else {
        updateCategories([...categories, category]);
      }
    };
  }

  return (
    <div className="flex px-[18px] py-[20px] flex-col justify-center items-center gap-y-[20px] bg-[#f8f8f8] shadow-[0_1px_10px_0_rgba(0,0,0,0.10)] rounded-[20px]">
      <span className="text-[#8f8f8f] text-center">
        What categories do you want to add?
      </span>

      <div className="flex flex-row gap-x-[8px]">
        <SelectCategoryButton
          title="Things to do"
          icon={require('@/app/svgs/binoculars.svg')}
          onClick={selectCategory('do')}
          active={categories.includes('do')}
        />
        <SelectCategoryButton
          title="What to eat"
          icon={require('@/app/svgs/burger.svg')}
          onClick={selectCategory('eat')}
          active={categories.includes('eat')}
        />
      </div>

      <div className="flex flex-row gap-x-[8px]">
        <SelectCategoryButton
          title="Where to stay"
          icon={require('@/app/svgs/bed.svg')}
          onClick={selectCategory('stay')}
          active={categories.includes('stay')}
        />
        <SelectCategoryButton
          title="Places to shop"
          icon={require('@/app/svgs/money-bag.svg')}
          onClick={selectCategory('shop')}
          active={categories.includes('shop')}
        />
      </div>
    </div>
  )
}

export function SelectCategoryButton({ title, icon, active, onClick }: { title: string, active?: boolean, icon: string | StaticImport, onClick: () => void }) {
  const activeBtnClass = active ? 'border-[#1E88E5] border-[2px] bg-[#D7ECFF]' : '';
  const activeTextClass = active ? 'text-[#1E88E5]' : 'text-[#B9B9B9]';
  const activeIconClass = active ? 'text-[#1E88E5]' : 'text-[#B9B9B9]';
  return (
    <button
      className={cn("flex flex-row gap-x-[8px] p-[20px] bg-[#EBEBEB] rounded-[10px] w-[313px] items-center justify-center border-[2px] border-transparent", activeBtnClass)}
      onClick={onClick}
    >
      <Image src={icon} alt="Do" width={24} height={24} color='blue' className={activeIconClass} />
      <span className={cn('text-[#B9B9B9] text-[16px]', activeTextClass)}>
        {title}
      </span>
    </button>
  )
}
