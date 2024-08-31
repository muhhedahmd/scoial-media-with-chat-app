import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User2Icon } from 'lucide-react';
import React from 'react'

const UserAvatar = ({ src, size = 40 }: { src?: string; size?: number }) => {
  console.log({
    src
  })
  return (
    <Avatar className={`w-${size} h-${size}`}>
      <AvatarImage src={src} />
      <AvatarFallback>
        <User2Icon />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar