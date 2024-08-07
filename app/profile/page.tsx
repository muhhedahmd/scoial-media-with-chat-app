"use client"

import { getServerSession } from 'next-auth'
import { getSession, SessionProvider, useSession } from 'next-auth/react'
import React from 'react'

const Page =   () => {
  // const session = getSession()
  const session = useSession()
  if(session.status === "loading"){
    return <div>Loading...</div>
  }
  if(session.status === "unauthenticated"){
    return <div>Not logged in</div>
    }
    

  return (
    <div>
profile
{JSON.stringify(session.data?.user)}
    </div>
  )
}

export default Page