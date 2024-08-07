"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
        <p>
            profile layout
        </p>
<SessionProvider>


        {children}
</SessionProvider>
        
        </div>
  )
}

export default layout