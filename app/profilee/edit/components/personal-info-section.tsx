"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { User, MapPin, Phone, Calendar, FileText } from "lucide-react"

export default function PersonalInfoSection() {
  const { control } = useFormContext()

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Title
            </FormLabel>
            <FormControl>
              <Input placeholder="Your Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bio
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Tell others about yourself" className="resize-none min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </FormLabel>
              <FormControl>
                <Input placeholder="Your location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="PhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </FormLabel>
              <FormControl>
                <div
                className="relative flex items-center border border-input rounded-md"
                >

                <Input  type="tel" placeholder="Your phone number" {...field} 
                className=" pl-[2.5rem]"
                />
                <p
                className=" absolute h-full w-[fit-content] p-0 top-[0] flex items-center pl-[.5rem] left-[0]  pr-[3px] rounded-tl-[5px] rounded-br-[0] rounded-tr-[0] rounded-bl-[5px] text-[14px]" 
                >

                +20

                </p>

                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Birthdate
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
