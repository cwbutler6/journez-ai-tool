'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import AIIcon from '@/app/svgs/ai-icon.svg'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import useAppStore from '@/store/app'

export default function SearchInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places')
  const { location, updateLocation } = useAppStore();

  useEffect(() => {
    if (places && inputRef.current) {
      const autocomplete = new places.Autocomplete(inputRef.current)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        updateLocation(place.formatted_address || place.name || '')
      })
  
      return () => {
        autocomplete.unbindAll()
      }
    }
  }, [places, updateLocation]);

  return (
    <div className="flex flex-row rounded-[20px] bg-[#f8f8f8] shadow-[0_1px_10px_0_rgba(0,0,0,0.10)] px-[12px] py-[18px] w-full">
      <Image src={AIIcon} alt="AI Icon" width={22} height={22} />
      <input
        type="text"
        placeholder="Enter a location"
        className="w-full bg-transparent border-none focus:outline-none grow ml-2"
        value={location}
        onChange={(e) => updateLocation(e.target.value)}
        ref={inputRef}
      />
    </div>
  )
}

