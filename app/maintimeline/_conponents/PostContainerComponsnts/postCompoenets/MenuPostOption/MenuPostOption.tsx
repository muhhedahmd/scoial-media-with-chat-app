import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { Clipboard, Edit, Trash, Pin, Star, Save, Archive, AlertTriangle, EllipsisVertical } from 'lucide-react'
import React from 'react'

const MenuPostOption = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical className="text-gray-500 hover:text-gray-700 transition-colors" />
      </PopoverTrigger>
      <PopoverContent className=" p-4 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col gap-2">
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Clipboard className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Copy Post link</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Edit className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Edit Post</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Trash className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Delete Post</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Pin className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Pin Post</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Star className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Mark as Favorite</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Save className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Save Post</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <Archive className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Archive Post</span>
          </Button>
          <Button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors' variant={"link"}>
            <AlertTriangle className="text-muted-foreground  w-2/12 " />
            <span className="text-gray-800 text-start text-small w-3/4">Report Post</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MenuPostOption
