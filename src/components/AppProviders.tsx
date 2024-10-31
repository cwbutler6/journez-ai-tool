"use client";

import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { createClient } from '@/lib/supabase'

export default function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = createClient()
  
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
      {children}
    </APIProvider>
  )
}
