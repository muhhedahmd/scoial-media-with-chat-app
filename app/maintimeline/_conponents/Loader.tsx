import { Skeleton } from "@/components/ui/skeleton"



export const ProfileImageLoader = ()=>{
    return (
        <Skeleton  className="rounded-full absolute top-[19%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-gray-500 w-20 h-20" />
    )
}

export const CoverImageLoader = ()=>{
    return (
        <Skeleton  className="h-28 rounded-lg object-cover bg-slate-950 w-full" />
    )
}