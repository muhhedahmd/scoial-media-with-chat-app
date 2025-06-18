"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Save_catagory } from "@prisma/client"

const SaveCategory = ({
  item,

  active,
  disabled,
  handleToggle,
}: {
  item: Save_catagory
  active: boolean
  disabled: boolean
  handleToggle: (str: string) => void
}) => {
  return (
    <div>
      <Button
        disabled={disabled}
        onClick={() => handleToggle(item.name)}
        size={"default"}
        key={item.id}
        className={cn(
          active && "bg-emerald-100 text-emerald-700  hover:bg-red-100 hover:text-gray-500",
          "p-2  text-start flex justify-start items-start w-full  text-[1rem]",
        )}
        variant={"ghost"}
      >
        {item.name}
      </Button>
    </div>
  )
}

export default SaveCategory
