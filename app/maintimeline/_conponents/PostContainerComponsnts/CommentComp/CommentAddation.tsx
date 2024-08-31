import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAddCommentMutation } from '@/store/api/apicomment'
import React, { useState } from 'react'

interface CommentAddationProps{
    postId: number
    userId: number
}

const CommentAddation = ({
    userId ,
    postId
} :CommentAddationProps) => {
    const [ addComment , {
        isLoading ,
 
    }] = useAddCommentMutation()
    const [comment , setComment] = useState('')
    const handleSubmit = ()=>{
        if(comment){
            addComment({author_id:userId , post_id: postId , content : comment.trim()})
            setComment("")

        }

    }
  return (
    <form
    className="flex w-full gap-3 justify-start items-center"
    >
      <Input disabled={isLoading} placeholder='Enter your comment' onChange={e=>setComment(e.target.value)} value={comment} className='w-3/4'/>
      <Button disabled={isLoading} type='button' className='w-1/3' variant={"ghost"} onClick={handleSubmit}>comment</Button>
    </form>
  )
}

export default CommentAddation
