import React from 'react'
import Image from 'next/image';
import Logo from "@/app/svgs/logo.svg"
import SearchInput from './SearchInput';
import SelectCategory from './SelectCategory';
import SelectNumOfLocations from './SelectNumOfLocations';
import SearchBtn from './buttons/SearchBtn';

export default function SearchComponent() {
  return (
    <div className="flex flex-col items-center pt-[30px] pb-[60px] px-[68px] grow bg-white rounded-[40px] shadow-[0_0_20px_1px_rgba(0,0,0,0.05)]">
      <Image src={Logo} alt="Logo" width={100} height={118} priority />
      
      <div className="gap-y-[30px] max-w-[670px] w-full flex flex-col justify-center grow">
        <div className="mb-[30px]">
          <SearchInput />
        </div>

        <SelectCategory  />

        <SelectNumOfLocations />

        <SearchBtn />
      </div>
    </div>
  )
}
