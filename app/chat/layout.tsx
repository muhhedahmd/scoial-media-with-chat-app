// "use client"
import { PresenceProvider } from '@/context/PresenceContext'
import { authOptions } from '@/lib/authOptions'
import { User } from '@prisma/client'
import { getServerSession } from 'next-auth'
import React from 'react'

const Layout =  async ({
    children
} :{ 
    children : React.ReactNode
}) => {
    // const authenticatedUser = useSelector(userResponse)!;


    const session = await getServerSession(authOptions)


    if(!session?.user) return 

  return (
    <div className='w-full h-auto'>
        
        <PresenceProvider  
         authenticatedUser={session.user as User}
        >
        {children}
        </PresenceProvider>
    </div>
  )
}

export default Layout