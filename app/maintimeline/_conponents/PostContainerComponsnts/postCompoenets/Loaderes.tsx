"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export const PostCreationLoader = () => {
  return (
    <div className="bg-white rounded-xl p-4 sticky top-0 h-1/6 w-full shadow-md">
      <div className="flex justify-between items-center gap-3 w-full">
        <Skeleton
          className="w-10 h-10 bg-gray-300 rounded-full sm:w-14 sm:h-14" // Adjusted for mobile
        />
        <Skeleton className="w-4/6 sm:w-5/6 bg-gray-300 h-9" />
        <Skeleton className="w-14 h-9 bg-gray-300" />
      </div>
      <InteractionButtonsLoader />
    </div>
  )
}

export const HeaderPostLoader = () => {
  return (
    <div className=" w-full flex justify-start items-center gap-3">
      <Skeleton className="w-12 rounded-full h-12 bg-gray-300 " />
      <div className="flex w-full justify-start items-start gap-2 flex-col">
        <Skeleton className="w-1/4 h-2 bg-gray-300" />
        <Skeleton className="w-1/5 h-2 bg-gray-300" />
      </div>
    </div>
  )
}
export const HeaderPostLoaderNotifaction = () => {
  return (
    <div className=" w-full flex justify-start items-start flex-col gap-3">
      <div className="flex justify-start w-full items-center gap-3">
        <Skeleton className="min-w-12 rounded-full min-h-12 bg-gray-300 " />
        <div className="flex w-full justify-between items-start  gap-2 flex-row">
          <Skeleton className="w-2/3 h-2 bg-gray-300" />
          <Skeleton className="w-1/5 h-2 bg-gray-300" />
        </div>
      </div>
      <div
        className="flex  justify-start gap-2 flex-col items-start
        w-full
        "
      >
        <Skeleton className="min-w-[90%] h-2 bg-gray-300" />
        <Skeleton className="min-w-[70%] h-2 bg-gray-300" />
      </div>
    </div>
  )
}

export const InteractionsLoader = () => {
  return (
    <div className=" flex mt-3 justify-start items-center gap-3 w-full">
      <Skeleton className="w-3/12 h-6 bg-gray-300" />
    </div>
  )
}

export const ContentPostLoader = () => {
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    // Use client-only logic to decide what to render
    setShowImage(Math.round(Math.random() * 10) % 2 === 0)
  }, [])

  return (
    <div className="w-full mt-3 flex h-full justify-start flex-col items-start gap-3">
      <Skeleton className="h-2 w-2/3 bg-gray-300" />
      {showImage ? (
        <>
          <Skeleton className="h-2 w-full bg-gray-300" />
          <Skeleton className="h-[25rem] w-full bg-gray-300" />
        </>
      ) : (
        <Skeleton className="h-4 w-full bg-gray-300" />
      )}
    </div>
  )
}
export const InteractionButtonsLoader = () => {
  return (
    <div className="flex justify-start items-center gap-3 mt-3 w-full">
      <Skeleton className="w-1/4 h-9 bg-gray-300" />
      <Skeleton className="w-1/4 h-9 bg-gray-300" />
      <Skeleton className="w-1/4 h-9 bg-gray-300" />
      <Skeleton className="w-1/4 h-9 bg-gray-300" />
    </div>
  )
}
export const SuggestionLoader = () => {
  return (
    <div className="relative gap-2 flex-col p-3 pt-0 overflow-y-auto overflow-x-hidden flex justify-start items-start bg-white rounded-lg h-[30%] border-2 shadow-md w-full">
      <div className="flex sticky top-0 z-10 bg-white p-1 justify-between items-center w-full">
        <p className=" font-normal ">Suggestions Users</p>
        <div>
          <p className=" font-normal ">See all</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 justify-start items-start w-full">
        {Array.from({ length: 10 }).map((_, i) => {
          return (
            <div key={i} className="flex w-full gap-2 justify-start items-center">
              <Skeleton className="w-10 h-10 rounded-full bg-slate-300" />
              <div className="flex w-full flex-col justify-between gap-3 items-start">
                <Skeleton className="w-[90%] h-5 bg-slate-300" />
                <Skeleton className="w-[50%] h-5 bg-slate-300" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
