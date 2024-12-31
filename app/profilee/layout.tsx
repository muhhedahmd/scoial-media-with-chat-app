"use client";
import Sidebar from "./_components/sidebar";

import Header from "../maintimeline/_conponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";
import { PaginationContextProfilee } from "@/context/PaggnitionSystemProfile";
import { Suspense, useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { setPaginationForTab, Taps } from "@/store/Reducers/pagganitionSlice";


const Layout = ({ children }: { children: React.ReactNode }) => {

  const CachedUser = useSelector(userResponse)!;

  const [initePagnition  , setinitePagnition]= useState()
  const dispatch = useDispatch<AppDispatch>();

  const profiles = useSelector((state: RootState) => state.pagination.multiProfileMain.profiles);
 
  useEffect(()=>{

    if(CachedUser?.id) {
      
    dispatch(
      setPaginationForTab({
        tab : Taps.likes ,
        userId : `${CachedUser.id}`,
        skip : 0  ,
        stop : false ,
        take:10
      })
    )
  }


  } , [CachedUser?.id, dispatch] )

if(!CachedUser) return
  return (
    <div className="relative flex flex-col  bg-gradient-to-r from-slate-300 to-slate-500 overflow-hidden max-h-screen justify-start items-start w-full min-h-screen">
      <Suspense 
      fallback={<>
      
      loading ...
      </>}
      >

      <Header
      user={CachedUser}
      
      
      />
      {/* Sidebar for larger screens */}
      <div
      style={{
        maxHeight : "calc(100vh - 40px)"
      }}
      className="flex h-min w-full mt-4 gap-4 overflow-hidden justify-center items-start"
      >


      <Sidebar />

      {/* Main Content Area */}
   
   <PaginationContextProfilee>

          {/* Your main content */}
          {children}
   </PaginationContextProfilee>
      </div>


      {/* Extra content for testing scrolling */}
      {/* <div className="h-[300vh]" /> */}
      </Suspense>
    </div>
  );
};

export default Layout;
