"use client";

import React from 'react'
import { Button } from '../ui/button';
import useAppStore from '@/store/app';

export default function ExportBtn({ data=[] }: Readonly<{ data: {[k: string]: any}[] }>) {
  const { exportResults } = useAppStore();
  return (
    <Button
      className='bg-[#373737] rounded-[20px] shadow-[0_1px_10px_1px_rgba(0,0,0,0.10)] w-[222px]'
      onClick={() => exportResults(data)}
      disabled={!data.length}
    >
      <span>Export</span>
    </Button>
  )
}
