import { Skeleton } from "@/components/ui/skeleton"
import { useGetUserQuery } from "@/store/api/apiUser"

const UserInfoHeader = ({ author_id }: { author_id: number }) => {
  const { data: commentedUSer, isLoading: loadingUSer } = useGetUserQuery({
    userId: +author_id,
  })

  if (loadingUSer) {
    ;<div>
      <Skeleton className="w-20 h-2 bg-gray-200" />
      <Skeleton className="w-20 h-2 bg-gray-200" />
    </div>
  } else
    return (
      <div className="flex justify-between items-center">
        <span className="font-semibold flex flex-col justify-start items-ceter  text-gray-800">
          {commentedUSer?.first_name + " "} {commentedUSer?.last_name}
        </span>
      </div>
    )
}

export default UserInfoHeader
