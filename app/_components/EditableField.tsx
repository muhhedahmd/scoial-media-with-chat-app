import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React from 'react'
import { z } from 'zod'
import { ProfileSchema } from '../auth/signup/_comsponents/schema'
import { Textarea } from '@nextui-org/input'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { Control } from 'react-hook-form'

const EditableField = ({
    name,
    icon,
    label,
    placeholder,
    type = "text",
    editStatus ,
control ,
  }: {
      name: keyof z.infer<typeof ProfileSchema>
      icon: React.ReactNode
      label: string
      type?: string
      placeholder: string
      editStatus :boolean ,
  control : Control<typeof ProfileSchema._type >
  }) => (
    <FormField

    disabled={editStatus}
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="space-y-2 relative">
          <FormLabel className="flex items-center gap-2">
            {icon}
            {label}
          </FormLabel>
          <FormControl>
            {
            name === "user_name" ?
            <div 
            className='relative w-full '
            >
              {
                // control.getFieldState("user_name").isTouched &&
              <span className=' text-emerald-700 absolute top-[.5rem] left-[.8rem]'>
                @ 
              </span>
              }

            <Input 
            className='pl-[2rem]'
            disabled={editStatus}
            
            
            type={type} placeholder={placeholder} {...field}  />

            </div>
            
            :type === "textarea" ? (
              <Textarea
               
              disabled={editStatus}
              placeholder={placeholder} {...field} />
            ) : type === "date" ? (
              <Input
              disabled={editStatus}
                type="date"
                value={
                  field.value
                    ? new Date(field.value).toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  field.onChange(new Date(e.target.value))
                }
              />
            ) :
              <Input 
              disabled={editStatus}
              type={type} placeholder={placeholder}  {...field} />

            }
          </FormControl>
          <FormMessage />
          <Pencil className="w-4 h-4 absolute right-2 top-8 text-gray-400" />
        </FormItem>
      )}
    />
  )

export default EditableField