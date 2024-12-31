import { Skeleton } from "@/components/ui/skeleton";
import { UserWithPic } from "@/app/api/chat/contacts-users/route";
import { useChoseMemberGroup } from "@/context/ChoseMemberGroupContext";
import { useGetUserNameQuery } from "@/store/api/apiUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
import { Badge } from "@/components/ui/badge";

const SearchcontactListUsers = ({
  debouncedSearchTerm,
  userId,
}: {
  userId: number;
  debouncedSearchTerm: string;
}) => {
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetUserNameQuery(
    {
      userId: userId,
      search: debouncedSearchTerm,
      size: 0,
      take: 20,
    },
    {}
  );

  const { ChoseMemberGroup, setChoseMemberGroup } = useChoseMemberGroup();
  const [usersList, setUsersList] = useState<ShapeOfUserSearchMention[]>([]);
  useEffect(() => {
    // { user_name: { contains: search, mode: 'insensitive' } },
    // { first_name: { contains: search, mode: 'insensitive' } },
    // { last_name: { contains: search, mode: 'insensitive' } },
    // { email: { contains: search, mode: 'insensitive' } },
    // {
    //   first_name: { contains: search.split(' ')[0], mode: 'insensitive' },
    //   last_name: { contains: search.split(' ')[1] || '', mode: 'insensitive' }
    // }
    //  user.user_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()
    // ||
    // user.first_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    // ||
    // user.last_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    // ||
    // user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    // ||
    // (user.first_name.toLowerCase().includes(debouncedSearchTerm.split(' ')[0].toLowerCase())
    // &&
    // user.last_name.toLowerCase().includes(debouncedSearchTerm.split(' ')[1] || '').toLowerCase()
    // )
    console.log(users?.data);
    if (users && users.data && users.data.length > 0) {
      const filteredUsers = users.data.filter((user) => {
        //   if(!user) return;
        const searchLower = debouncedSearchTerm.toLowerCase();
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();

        return (
          user.user_name.toLowerCase().includes(searchLower) ||
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          fullName?.includes(searchLower)
        );
      });
      setUsersList(filteredUsers);
    }
  }, [debouncedSearchTerm, setUsersList, users, users?.data]);

  if (isLoading || isFetching)
    return (
      <div className="flex flex-col mt-2  pt-2 gap-3">
        {Array.from({
          length: 8,
        }).map((arr, idx) => {
          return (
            <div key={idx} className="flex justify-start items-center gap-2">
              <Skeleton className="h-10 min-h-10 w-10 min-w-10 rounded-full bg-slate-300 " />

              <div className="flex flex-col  gap-2 justify-start items-start">

                <Skeleton className="h-2  bg-slate-300 w-20 rounded-md" />
                <Skeleton className="h-2 bg-slate-300 w-5 rounded-lg" />
              </div>
            </div>
          );
        })}
      </div>
    );

  return (
    <>
      {usersList &&
        !isFetching &&
        usersList.map((contact, index) => {
          const isInChoseMemberGroup = ChoseMemberGroup?.some(
            (user) => user.id === contact.id
          );
          const _user = contact as UserWithPic;
          const profile = _user.profile?.profilePictures?.find((img: any) => {
            return img.type === "profile";
          });
          return (
            <div
              key={contact.id}
              className="flex items-center relative gap-3 p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer mb-2"
              onClick={() => {
                setChoseMemberGroup((prev) => {
                  if (prev && contact) {
                    if (isInChoseMemberGroup) {
                      return prev.filter((user) => user.id !== contact.id);
                    } else {
                      return [...prev, contact as UserWithPic];
                    }
                  } else {
                    return [];
                  }
                });
              }}
            >
              {profile ? (
                <div className="flex shadow-md rounded-full justify-center items-center relative ">
                  <BluredImage
                    width={profile?.width! || 0}
                    height={profile?.height! || 0}
                    blurhash={profile?.HashBlur || ""}
                    imageUrl={profile?.secure_url || ""}
                    alt="profile_pictre"
                    quality={100}
                    className="w-10 h-10 shadow-md rounded-full"
                  />
                </div>
              ) : (
                <div className="w-10 h-10  bg-slate-100 shadow-md rounded-full flex justify-center items-center text-lg">
                  {contact.first_name[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 flex-col gap-1 justify-start items-start">
                <p className="font-medium truncate">
                  {contact.first_name + " " + contact.last_name}
                </p>
                <Badge className=" text-xs" variant={"outline"}>
                  {contact.hasChatted ? (
                    <span className="">chatted</span>
                  ) : contact.isFollowing ? (
                    <span className="">Follower</span>
                  ) : contact.isFollower ? (
                    <span className="">Following</span>
                  ) : (
                    <span className="">None</span>
                  )}
                </Badge>
              </div>
              <div className="flex relative flex-col items-end gap-3">
                {isInChoseMemberGroup && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default SearchcontactListUsers;
