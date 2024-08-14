"use client"
import {Swiper ,SwiperSlide}from "swiper/react"
import {  useSession } from 'next-auth/react'
import React from 'react'
import "swiper/css"
import MainInfo from "./_componsnets/MainInfo"
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
    <div className="w-full h-full">
      <Swiper
      className="w-full "
      style={{
        height :"calc(100vh  - 3rem)"
      }}
      
      slidesPerView={1}
      
      >


        <SwiperSlide
        
        className="w-full h-full"
        >
          <div
          className="w-full h-full bg-orange-300/30"
          >
              <MainInfo/>
          
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div
          className="w-full h-full bg-emerald-300"
          >

          2
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div
          className="w-full h-full bg-orange-300"
          >

          3
          </div>
        </SwiperSlide>

      </Swiper>

    </div>
  )
}

export default Page