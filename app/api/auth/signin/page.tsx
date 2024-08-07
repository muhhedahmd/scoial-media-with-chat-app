'use client'
import { signIn } from "next-auth/react";
import React, { useState } from "react";
const Page = () => {

    const [formState , setFormState] = useState({
      email: "asshxx@gmail.com",
      password:"asshxx"

    })

    const onSubmit =(e  : React.FormEvent<HTMLFormElement>)=>{
            e.preventDefault()

            if(!formState.email ||  !formState.password) return
                       signIn(
              "signin" ,
              {
                redirect: true,
                ...formState
              }
          
            )
    }
const onchange = (e : React.ChangeEvent<HTMLInputElement>)=>{
  const {name   ,value} = e.target
  

  setFormState((prev)=>{
    return {
      ...prev  , [name ] : value
    }    
  })
}
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form  
      
      className="flex flex-col justify-between bg-gray-800 w-1/2 h-1/2 gap-2 p-3 border-white border-2  rounded-md shadow-lg items-start"
      onSubmit={(e)=>onSubmit(e)}>
        
        <h2 className="w-full self-center text-center text-2xl">
          log in

        </h2>
  
        
        <div className="w-full  gap-3 flex flex-col items-start justify-start ">
        <label htmlFor="email"  >email</label>
        <input  className="text-black w-full"  value={formState.email}   onChange={onchange} type="email" id="email" name="email" placeholder="example@jo.com" />
        </div>
       
       <div className="w-full gap-3  flex flex-col items-start justify-start ">
        <label htmlFor="password"  >password</label>
        <input className="text-black w-full"   value={formState.password}    onChange={onchange}type="password" id="password" name="password" placeholder="************" />
       </div>
      
        <button
        className="  w-full py-1 hover:bg-white/55 transition-all self-center bg-white text-black"
        type="submit"
        >
            Create accuant

        </button>
      </form>
    </div>
  );
};

export default Page;
