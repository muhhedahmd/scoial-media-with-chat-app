import React from 'react'

interface props {
    params : {
        id: number ,
        photoid: number,

    }
}

const page = ({params : {photoid ,id }}: props) => {
  return (
    <div>page photoid : {  photoid} prev daynamic  id :{id}</div>
  )
}

export default page