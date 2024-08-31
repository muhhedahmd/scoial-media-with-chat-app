import { formatDistance } from 'date-fns';
import React from 'react'

const TimeStamp = ({created_at} :{created_at:Date}) => {
    const time = formatDistance(new Date(created_at), new Date());
    console.log({time ,created_at})

  return (
    <span className="text-sm text-gray-500">{time}</span>
  )
}

export default TimeStamp