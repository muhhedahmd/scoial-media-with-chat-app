import { User } from '@prisma/client'
import React, { Dispatch, SetStateAction } from 'react'
import Follower from './Follower'
import { followerType } from '@/app/api/follow/follower/[id]/route'
import { Contact } from '../page'

const SuggestionContacts = ({
    CachedUser ,
    setSelectedContact,
    setStartChatWith ,
    groupMinaml
} : {
  groupMinaml?: boolean,
  setSelectedContact : Dispatch<SetStateAction<Contact | null>> ,
  setStartChatWith  :React.Dispatch<React.SetStateAction<followerType | null>>
    CachedUser:User
}) => {
    
    if(!CachedUser) return 
  return (
    <div 
    className='w-full'
    >
        <Follower
        groupMinaml={groupMinaml}
        setSelectedContact={setSelectedContact}
        setStartChatWith={setStartChatWith}
        userId={CachedUser.id}
        />
        

        


    </div>
  )
}

export default SuggestionContacts