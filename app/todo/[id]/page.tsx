import { notFound } from 'next/navigation'
import React from 'react'

interface Props{
    params :{
        id:number
    }
}

const TodoTitle = ({params : {id}} : Props) => {
  if(id > 10) return notFound();
  return (
    <div>TodoTitle{id}</div>
  )
}

export default TodoTitle