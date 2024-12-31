// "use client"
// import gsap from 'gsap'
// import { usePathname, useSearchParams } from 'next/navigation'
// import React, { useCallback, useEffect, useRef, useState } from 'react'

// const NavProgress = () => {
//     const useRouterEvents = (callback: () => void) => {
//         const pathname = usePathname()
//         const searchParams = useSearchParams()
      
//         useEffect(() => {
//           callback()
//         }, [pathname, searchParams, callback])
//       }
//         const [isLoading, setIsLoading] = useState(false)
      
//         const [progress, setProgress] = useState(0)
      
//         const loaderRef = useRef(null)
      
    
//   const handleRouteChange = useCallback(() => {
//     setIsLoading(true)
//     setProgress(0)
    
//     // Simulate progress
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress >= 90) {
//           clearInterval(interval)
//           return prevProgress
//         }
//         return prevProgress + 10
//       })
//     }, 100)

//     // Simulate route change completion
//     setTimeout(() => {
//       clearInterval(interval)
//       setIsLoading(false)
//       setProgress(100)
//     }, 1000)
//   }, [])

//   useRouterEvents(handleRouteChange)

//   useEffect(() => {
//     gsap.to(loaderRef.current, {
//       duration: 0.3,
//       scaleX: progress / 100,
//       opacity: isLoading || progress < 100 ? 1 : 0,
//       ease: 'bounce.in'
//     })
//   }, [progress, isLoading])

//   return (
//     <div 
//     ref={loaderRef} 
//     className="fixed top-0  left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left scale-x-0"
//   />
//   )
// }

// export default NavProgress
import React from 'react'

const NavProgress = () => {
  return (
    <div>NavProgress</div>
  )
}

export default NavProgress