import React from 'react'
import BluredImage from '../_componsents/ImageWithPlaceholder'

const page = () => {
  return (
    <div className='flex justify-start gap-3 flex-wrap'>
<BluredImage
height={400}
width={400} 
imageUrl={"http://res.cloudinary.com/dycvu7mua/image/authenticated/s--F3VUTeJQ--/c_scale,e_blur,h_400,w_400/v1727184218/stti1/pwvgtmt1yquaos7lxcvd.jpg"}
alt='' 
className='rounded-full '
/>


    </div>
  )
}

export default page