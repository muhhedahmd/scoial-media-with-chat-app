import { useGetProfileQuery } from '@/store/api/apiProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const AvatarRep = ({author_id}:{
    author_id: number
}) => {
    const { data: profileData, isLoading: loaddingProfile } = useGetProfileQuery({
        userId: author_id,
      });
  return (
    <Avatar>
    <AvatarImage
      src={profileData?.profile_picture || ""}
      alt={profileData?.user_id + "profile_picture"}
      className="w-10 h-10 rounded-full"
    />
    <AvatarFallback>
      user
    </AvatarFallback>
  </Avatar>
  )
}

export default AvatarRep