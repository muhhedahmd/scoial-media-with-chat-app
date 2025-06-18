import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { Check, CheckCircle2Icon, Loader2, Lock, SearchIcon, User, Users, UserSquare2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const UserInfoProfileeEdit = () => {
  const { control } = useFormContext()
  const [isPasswordRight, setIsPasswordRight] = React.useState<"idel" | true | false>("idel");
  const [password, setPassword] = React.useState("")
  // const [password, setPassword] = React.useState("")
  const [isUserNotNameTaken, setIsUserNotNameTaken] = React.useState<"idel" | true | false>("idel");
  const [loadingUSerName, setISLoadingUSername] = useState(false)
  // const [password, setPassword] = React.useState("")



  const checkPass = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.stopPropagation()
    e.preventDefault()
    await axios.post(process.env.NEXT_PUBLIC_API! + "/users/checkPassword", {
      password
    })
      .then((res) => {
        console.log(res.data)
        setIsPasswordRight(true)
      })
      .catch((err) => {
        console.log(err)
        setIsPasswordRight(false)
      })

  }

  const checkUserName = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setISLoadingUSername(true)
    const userName = control._getWatch("user_name")
    e.stopPropagation()
    e.preventDefault()
    await axios.post(process.env.NEXT_PUBLIC_API! + "/users/checkUserName", {
      userName
    })
      .then((res) => {
        console.log(res.data)
        setIsUserNotNameTaken(true)
        setISLoadingUSername(false)
      })
      .catch((err) => {
        console.log(err)
        setIsUserNotNameTaken(false)
      }).finally(() => setISLoadingUSername(false))

  }



  return (
    <div className='flex justify-start items-start gap-6 w-full flex-col'>

      <div className='flex justify-start items-start gap-3 w-full'>


        <FormField
          control={control}



          name="first_name"
          render={({ field }) => (

            <FormItem
              className='w-full'
            >
              <FormLabel className="flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name
              </FormLabel>
              <FormControl>
                <Input placeholder={"Your first name"} {...field} />
              </FormControl>
              <FormMessage
              />
            </FormItem>
          )}
        />
        <FormField
          control={control}


          name="last_name"
          render={({ field }) => (
            <FormItem

              className='w-full'

            >
              <FormLabel className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Last Name
              </FormLabel>
              <FormControl>
                <Input placeholder={"Your last name"} {...field} />
              </FormControl>
              <FormMessage
              />
            </FormItem>
          )}
        />
      </div>

      <div className='w-full'>

        <div className="flex items-start w-full   mb-6 justify-start gap-3">
          <FormField

            name="gender"
            control={control}
            render={({ field }) => (
              <FormItem

                className="w-full"
              >
                <FormLabel className='flex justify-start items-center gap-2'> 
                  <UserSquare2
                  className='w-4 h-4 '
                  />
                  Gender
                  </FormLabel>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">
                          {`PREFER NOT TO SAY`}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
          
            name="role"
            control={control}
            render={({ field }) => (
              <FormItem

                className="w-full"
              >
                <FormLabel className='flex justify-start items-center gap-2'> 
                  <Users 
                  className='w-4 h-4 '
                  />
                  Role
                  </FormLabel>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div

          className='flex justify-start flex-col w-full gap-6'>

          <FormField

            disabled={isPasswordRight !== true}

            control={control}

            name="user_name"
            render={({ field }) => (
              <FormItem

              >
                <FormLabel

                  className={cn("flex items-center gap-2",

                    isPasswordRight !== true && "text-muted-foreground cursor-not-allowed"
                  )}>
                  <User className="w-4 h-4" />
                  user name
                </FormLabel>
                <FormControl>
                  <div className='flex justify-start items-center gap-3 w-full'>

                    <Input
                      className={cn("w-full", isUserNotNameTaken === true && " border-1 border-emerald-500 ",
                        isUserNotNameTaken === false && " border-1 border-red-500 "

                      )} //'w-full'}

                      placeholder={"Your user name"} {...field} />
                    <Button

                      onClick={checkUserName}
                      disabled={isPasswordRight !== true || loadingUSerName}
                      variant={"outline"}>
                      {
                        loadingUSerName ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          isUserNotNameTaken ===
                            true ? (
                            <CheckCircle2Icon className="w-4 h-4" />
                          ) : (
                            <SearchIcon className="w-4 h-4" />
                          )
                        )
                      }
                    </Button>
                  </div>

                </FormControl>
                <FormMessage
                />
              </FormItem>
            )}
          />


          <FormField
            disabled={isPasswordRight !== true}
            control={control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn("flex items-center gap-2",
                    isPasswordRight !== true && "text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <User className="w-4 h-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPasswordRight !== true}
                    placeholder={"Email"} {...field} />
                </FormControl>
                <FormMessage
                />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full flex justify-center items-center gap-6 mt-2 '>
          <div className='w-full my-3'>


            <Label

              htmlFor='password' className={cn("' mb-2 flex justify-start items-center gap-2 font-normal text-sm'", isPasswordRight && "text-muted-foreground cursor-not-allowed")}  >

              <Lock className='w-4 h-4' />
              Password Check
            </Label>
            <div className='flex justify-start items-center gap-2'>

              <Input
                disabled={isPasswordRight === true}
                placeholder='**********'
                className={cn("w-full", isPasswordRight === true && " border-1 border-emerald-500 ",
                  isPasswordRight === false && " border-1 border-red-500 "
                )}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <Button
                disabled={isPasswordRight === true}
                variant='outline'
                type='button'
                onClick={(e) => checkPass(e)}>check</Button>

            </div>
          </div>
        </div>
      </div>
      <div className=' -mt-6 flex justify-between items-center w-full'>

        <Button variant={"ghost"} className='text-muted-foreground text-xs'>
          Change password
        </Button>
      
      </div>
    </div>
  )
}

export default UserInfoProfileeEdit