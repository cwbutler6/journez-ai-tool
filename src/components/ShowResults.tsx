import React from 'react'
import CategoryList from './CategoryList';
import ExportBtn from './buttons/ExportBtn';
import NewSearchBtn from './buttons/NewSearchBtn';
import { askAIForLocations } from '@/lib/api';

export default async function ShowResults({ categories, location, numberOfLocations }: { categories: string[], location: string, numberOfLocations: number }) {
  const locations = await askAIForLocations({ categories, location, numberOfLocations })
  return (
    <div className="flex flex-col grow rounded-[40px] shadow-[0_0_20px_1px_rgba(0,0,0,0.05)]">
      <div className='flex flex-col grow p-[40px] gap-y-[20px]'>
        {locations.map((location, index) => <CategoryList key={index} label={getCategoryName(location.category)} places={location.recommendations} />)}
      </div>
      <div className='flex flex-row justify-center items-center gap-x-[16px] h-[78px] border-t-[1px] border-[#E5E5E5]'>
        <ExportBtn data={locations} />
        <NewSearchBtn />
      </div>
    </div>
  )
}

function getCategoryName(category: string) {
  switch (category) {
    case 'do':
      return 'Things To Do';
    case 'eat':
      return 'What To Eat';
    case 'stay':
      return 'Where To Stay';
    case 'shop':
      return 'Places To Shop';
    default:
      return '';
  }
}
