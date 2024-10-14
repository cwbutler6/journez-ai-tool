"use client";

import React from "react";
import Image from "next/image";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { FC, memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Recommendation } from "@/lib/api";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";

interface CategoryListProps {
  label: string;
  places?: Recommendation[];
}

const CategoryList: FC<CategoryListProps> = memo(function CategoryListComponent({ label, places=[] }: CategoryListProps) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible className='rounded-[20px] border-[2px] border-[#F6F6F6]' onOpenChange={setOpen}>
      <CollapsibleTrigger className={cn('p-[30px] w-full flex flex-row items-center justify-between')}>
        <span className='text-[24px]'>{label}</span>
        <Image src={require("@/app/svgs/plus.svg")} alt='plus' width={20} height={20} className={cn(open && 'rotate-45')} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className='flex flex-row gap-[24px] px-[24px] flex-wrap'>
          {places.map((place) => (
            <div key={place.name} className='flex flex-col p-[20px] pb-[20px] rounded-[24px] bg-[#F6F6F6] w-[335px] min-h-3 gap-y-[12px]'>
              <div className="w-full h-[150px] rounded-[12px] flex items-center justify-cente relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {place.photos.map((photo) => (
                      <CarouselItem key={photo} className="h-[150px] relative">
                        <Image src={photo} alt={place.name} className="rounded-md" fill objectFit="cover" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-[50%] left-[8px]" />
                  <CarouselNext className="absolute top-[50%] right-[8px]" />
                </Carousel>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px]">
                <span className="text-[16px] font-sans font-bold">Name: </span>
                <span className="text-[16px] font-sans">{place.name}</span>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px]">
                <span className="text-[16px] font-sans font-bold">Description: </span>
                <span className="text-[16px] font-sans">{place.description}</span>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px]">
                <span className="text-[16px] font-sans font-bold">Address: </span>
                <span className="text-[16px] font-sans">{place.address}</span>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px]">
                <span className="text-[16px] font-sans font-bold">Geolocation: </span>
                <span className="text-[16px] font-sans">{place.latitude}, {place.longitude}</span>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px]">
                <span className="text-[16px] font-sans font-bold">Hours: </span>
                <span className="text-[16px] font-sans">{place.hours.join('')}</span>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px]">
                <span className="text-[16px] font-sans font-bold">Phone: </span>
                <span className="text-[16px] font-sans">{place.phone}</span>
              </div>

              <div className="px-[8px] py-[4px] bg-[#DBDBDB] rounded-[4px] whitespace-pre-wrap">
                <span className="text-[16px] font-sans font-bold">Website: </span>
                <Link href={place.website ?? "#"} target="_blank" className="break-words">
                  <span className="text-[16px] font-sans">{place.website}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
})

export default CategoryList;
