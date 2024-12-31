'use client'

import React, { createContext, useState, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/mainUser"



interface PaginationContextProps {
  active: number
  setActive: React.Dispatch<React.SetStateAction<number>>
  // pg_takes_skip_multi: PaginationState[]
  // set_pg_takes_skip_multi: React.Dispatch<React.SetStateAction<PaginationState[]>>
  // resetPagination: () => void
}

const PaginationContext = createContext<PaginationContextProps | undefined>(undefined)

export function PaginationContextProfilee({ children }: { children: React.ReactNode }) {
  const CachedUser = useSelector(userResponse)!
  const [active, setActive] = useState(0)

  // const [pg_takes_skip_multi, set_pg_takes_skip_multi] = useState<PaginationState[]>(() => {
  //   const storedData = sessionStorage.getItem("pg_takes_skip_multi")
  //   return storedData
  //     ? JSON.parse(storedData)
  //     : [
  //         {
  //           userId: CachedUser.id,
  //           main: false,
  //           posts: { take: 10, skip: 0, stop: false },
  //           media: { take: 10, skip: 0, stop: false },
  //           likes: { take: 10, skip: 0, stop: false },
  //         },
  //       ]
  // })

  // useEffect(() => {
  //   sessionStorage.setItem("pg_takes_skip_multi", JSON.stringify(pg_takes_skip_multi))
  // }, [pg_takes_skip_multi])

  // const resetPagination = () => {
  //   set_pg_takes_skip_multi((prev) =>
  //     prev.map((item) => ({
  //       ...item,
  //       posts: { ...item.posts, skip: 0, stop: false },
  //       media: { ...item.media, skip: 0, stop: false },
  //       likes: { ...item.likes, skip: 0, stop: false },
  //     }))
  //   )
  // }

  

  return (
    <PaginationContext.Provider
      value={{
        active,
        setActive,
        // pg_takes_skip_multi,
        // set_pg_takes_skip_multi,
        // resetPagination
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}

export function usePaginationProfile() {
  const context = useContext(PaginationContext)
  if (!context) {
    throw new Error("usePaginationProfile must be used within a PaginationProvider")
  }
  return context
}