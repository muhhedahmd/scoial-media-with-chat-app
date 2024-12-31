'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const WaveAnimation = () => {
  const dotsRef = useRef<SVGGElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!dotsRef.current || !circleRef.current) return

    gsap.to(".circle", {
      y: -10,
      scale:1.25,
      duration: 0.3,
      stagger: 0.2,
      repeat: -1,
      ease: 'power2.inOut',
      yoyo: true
    })

    const ringSound = () => {
      try {
        if (audioRef.current) {
          audioRef.current.play()
        } else {
          console.log("Audio reference is not set properly.")
        }
      } catch (error) {
        console.log("Error playing sound:", error)
      }
    }

    // Start the sound playing every 3 seconds
    const soundInterval = setInterval(ringSound, 3000)

    return () => clearInterval(soundInterval)

  }, [])

  return (
    <>
      <audio ref={audioRef} className='w-0 h-0' src="/phone-ringing-tone-75510.mp3" preload="auto" />
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle ref={circleRef} cx="50" cy="50" r="0" fill="none" stroke="white" strokeWidth="2" />

      <g ref={dotsRef} className="w-full h-full">
        <circle cx="30" cy="50" r="5" fill="white" className="circle" />
        <circle cx="50" cy="50" r="5" fill="white" className="circle" />
        <circle cx="70" cy="50" r="5" fill="white" className="circle" />
      </g>

      {/* Add the audio element */}
    </svg>
    </>
  )
}

export default WaveAnimation
