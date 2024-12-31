import React, { Suspense } from 'react'

const layout = ({
    children,
} : {
    children :React.ReactNode
}) => {
  return (

    <div> 
        
        <Suspense>

        {children}
        </Suspense>
        </div>
  )
}

export default layout