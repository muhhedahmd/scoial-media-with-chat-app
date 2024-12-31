'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/Supabase'


export default function UseSupabaseListener(table : string) {
    const [updated , setUpdated] = useState()
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter :
          `
          `,
          

        },
        (payload: any) => {
            setUpdated(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])

  return {
    updated
  }
}