'use client'

import React, { Suspense, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { debounce } from "lodash"
import dynamic from "next/dynamic"
const Profile = dynamic(

  ()=>  import("./_components/profileData") , 
  {
    ssr: false,
   
    loading: () =>      <Skeleton
    // ref={scrollContainerRef} // Attach the scrollContainerRef to the scrollable container
    className="flex w-full  md:w-[50vw] flex-col  max-h-[90vh] rounded-md   bg-white  text-white "
  >


  </Skeleton>,    

  }
)
import { userResponse } from "@/store/Reducers/mainUser"
import { usePaginationProfile } from "@/context/PaggnitionSystemProfile"
import { AppDispatch, AppStore, RootState } from "@/store/store"
import { setPaginationForTab, Taps } from "@/store/Reducers/pagganitionSlice"
import { Skeleton } from "@nextui-org/react"

export default function ProfileSection() {


  const CachedUser = useSelector(userResponse)!
  const dispatch = useDispatch<AppDispatch>();

  const profiles = useSelector((state: RootState) => state.pagination.multiProfileMain.profiles);
  const {
    active,
  } = usePaginationProfile()

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)



  const handleScroll = 
    debounce(() => {
      if (scrollContainerRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = scrollContainerRef.current
        setIsScrolled(scrollTop > 520)


        const distance =  520
        const shouldPaginate = scrollTop + clientHeight+ distance  > scrollHeight
   

        if(!CachedUser.id) return 
        else if ( active === 0 ) {
 
 
          const isStop    = profiles[CachedUser.id] &&   profiles[CachedUser.id][Taps.posts] && 
          profiles[CachedUser.id][Taps.posts].stop 
         
          console.log(
           { profiles : profiles[CachedUser.id] ,
            isStop
           }
          )
          if (shouldPaginate && !isStop
            
          
          ) {

          dispatch(
            setPaginationForTab(
              {
                skip : profiles[CachedUser.id][Taps.posts].skip +1 ,
                take : profiles[CachedUser.id][Taps.posts].take,
                stop :   profiles[CachedUser.id][Taps.posts].stop,
                userId :`${CachedUser.id}`,
                tab : Taps.posts
              }
            )
          )
          }
        }
      }
    }, 300)

  useEffect(() => {
    const currentScrollContainer = scrollContainerRef.current
    if (currentScrollContainer) {
      currentScrollContainer.addEventListener("scroll", handleScroll)
      return () => {
        currentScrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <>
    <Suspense 
    fallback={
      <>
      loading...
      </>
    }
    >

    <div
      ref={scrollContainerRef}
      className="scrollprofile relative rounded-md flex flex-col lg:w-[50vw] scrollbar-hide w-full overflow-y-auto"
      >
      
      <Profile isScrolled={isScrolled} CachedUser={CachedUser} />
    </div>
        </Suspense>
      </>
  )
}