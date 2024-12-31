'use client'

import { Home, MoreHorizontal, User2, ChevronUp, ChevronDown, MessageCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname  } from 'next/navigation'
import React, { useEffect, useRef, useState,  } from 'react'
import { gsap } from 'gsap'

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import NotifcationPopup from '../maintimeline/_conponents/NotifcationComp/NotifcationPopup'
import { useSelector } from 'react-redux'
import { userResponse } from '@/store/Reducers/mainUser'
import { useLazyGetNotifcationQuery } from '@/store/api/apiNotifcation'

const navItems = [
  { href: '/maintimeline', icon: Home, label: 'Timeline' },
  { href: '/profilee', icon: User2, label: 'Profile' },
  { href: '/chat', icon: MessageCircleIcon, label: 'Chat' },
]



export default function BottomNav() {
  const user = useSelector(userResponse);
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const navRef = useRef(null)

  
  useEffect(() => {
    gsap.to(navRef.current, {
      duration: 0.1,
      y: isVisible ? 0 : '100%',
      ease: "power2.out",
    })
  }, [isVisible])


  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const [ fetchNotifcation , {
    data: Notifcations,
    isLoading,
    isFetching,
  }]=  useLazyGetNotifcationQuery();

  return (
    <>
  
      <TooltipProvider>
        <nav 
          ref={navRef}
          className="fixed bottom-0 z-[100] left-0 w-full py-2 bg-white dark:bg-gray-800 shadow-lg md:hidden border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out"
        >
           <Button
        variant="outline"
        size="icon"
        className="absolute -top-[26px] right-3 md:hidden flex justify-center items-center  rounded-full "

        onClick={toggleVisibility}
      >
        {isVisible ? <ChevronDown className="h-4 w-4 text-gray-600" /> : <ChevronUp className="h-4 w-4" />}
      </Button>
          <ul className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className={`relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-5 h-5" />
                          <span className="sr-only">{item.label}</span>
                          {isActive && (
                            <span className="absolute -top-1 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2" />
                          )}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              )
            })}
                  <NotifcationPopup 
                  
                  Notifcations={Notifcations}
isLoading={isLoading}
isFetching={isFetching}
                  fetchNotifcation={fetchNotifcation}  user={user}/>


                            <li >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className='text-gray-700 '
                      >
                        <MoreHorizontal className='w-5 h-5'/>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>More</p>
                    </TooltipContent>
                  </Tooltip>
                </li>

          </ul>
        </nav>
      </TooltipProvider>
     
    </>
  )
}