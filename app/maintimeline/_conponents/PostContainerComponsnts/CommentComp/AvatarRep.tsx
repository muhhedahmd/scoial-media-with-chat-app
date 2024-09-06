import { useGetProfileQuery } from "@/store/api/apiProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User, User2 } from "lucide-react";
import React from "react";

const AvatarRep = ({ author_id }: { author_id: number }) => {
  const { data: profileData, isLoading: loaddingProfile } = useGetProfileQuery({
    userId: author_id,
  });
  return (
    <Avatar>
      <AvatarImage
        src={profileData?.profile_picture || ""}
        alt={profileData?.user_id + "profile_picture"}
        className="w-10 h-10 rounded-full"
      />
      <AvatarFallback className="">
        <div
          className="h-10 w-10 rounded-full 
      flex justify-center items-center p-1
      text-sm
      border-2 border-[#e7e7e7]"
        >
          {!profileData?.profile_picture ? (
            <User2 className="w-4 h-4 " size={"sm"} />
          ) : (
            <></>
          )}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarRep;
