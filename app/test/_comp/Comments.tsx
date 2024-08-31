import { useGetPostCommentsQuery } from '@/store/api/apiSlice'
import React from 'react'

const Comments = () => {
    const {

    } = useGetPostCommentsQuery(10)
  return (
    <div>Comments</div>
  )
}

export default Comments