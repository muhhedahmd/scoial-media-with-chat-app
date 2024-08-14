"use client"
import React from 'react'
import Header from './_conponents/Header'
import { SessionProvider } from 'next-auth/react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="h-screen w-full">
        <Header/>
        <SessionProvider>

        {children}
        </SessionProvider>

    </div>
  )
}

export default layout