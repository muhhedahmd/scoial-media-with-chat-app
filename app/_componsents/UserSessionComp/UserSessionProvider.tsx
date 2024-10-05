"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import UserSessionManager from './Model'
const UserSessionProvider = ({

}) => {
  return (
    <SessionProvider>
        <UserSessionManager/>
    </SessionProvider>
  )
}

export default UserSessionProvider