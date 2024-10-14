"use client";

import Image from 'next/image'
import React from 'react'

export default function ThinkingView() {
  return (
    <div className="flex grow items-center justify-center bg-white">
      <Image src={require('@/app/images/thinking.gif')} alt="AI Thinking" width={200} height={200} priority unoptimized />
    </div>
  )
}
