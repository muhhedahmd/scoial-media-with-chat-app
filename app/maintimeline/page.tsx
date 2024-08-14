import React from 'react'
import PostContainer from './_conponents/PostContainer'
import MoreComponets from './_conponents/MoreComponets'
import UserInfo from './_conponents/UserInfo'

const page = () => {
  return (
    <div
    className=' relative gap-3 pt-4 bg-gray-100 px-4 flex h-full justify-start items-start'
    style={{
      height :'calc(100vh  - 3rem)'
    }}
    >
     
<UserInfo/>
      <PostContainer/>
      <MoreComponets/>
      
      
     
    </div>
  )
}

export default page