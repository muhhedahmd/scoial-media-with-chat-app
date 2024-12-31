// 'use client'
// import { Button } from '@/components/ui/button'

// import React, { useRef } from 'react'
// // import { useToastx } from '../context/Toster'
// import { cn } from '@/lib/utils'

// const Toastx = ({}) => {

//     // const test = useToastx()
//     // const state = test?.contenxtData 
//     // const setState = test?.setContextData

//     const TostRef = useRef<HTMLDivElement>(null)


//     // let text = state?.msg
//     // const clear  =  ()=>{
//     //     if(TostRef.current && TostRef){

//     //         TostRef.current.style.bottom = "-10rem" 
//     //     }
//     // }
    
//      return (
//     <div
//     ref={TostRef}

//     className={ cn('bg-black/70 transition-all shadow-md fixed flex flex-col justify-start items-start gap-3 rounded-md p-3 bottom-1 right-1 text-white min-h-[8rem] w-[17.25rem]',
        
//         state?.type === "warn" && "bg-yellow-600"
//         ,
//         state?.type=== "error" && "bg-red-300" ,
//         state?.type === "succes" && "bg-green-300",
//          )    } 
    
//     >
//         <p
//         className='self-center '
//         > 
//         {
//             text &&   text?.length > 100 ? text.slice(0, 35) +"..." : text
//         }
//         </p>

//         <Button 

//         onClick={()=>clear()}
//         className='self-end text-black'
//         variant={"outline"}
//         >
//             Dismiss
//         </Button>

//     </div>
//   )
// }

// export default Toastx
import React from 'react'

const Toastx = () => {
  return (
    <div>Toastx</div>
  )
}

export default Toastx