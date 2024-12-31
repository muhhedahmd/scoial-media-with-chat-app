import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { followerType } from "@/app/api/follow/follower/[id]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useCreateChatMutation } from "@/store/api/apiChat";
import { useGetFollowerNotchatQuery } from "@/store/api/apiFollows";
import React, { Dispatch, SetStateAction } from "react";
import { Contact } from "../page";
import { useChoseMemberGroup } from "@/context/ChoseMemberGroupContext";
import { UserWithPic } from "@/app/api/chat/contacts-users/route";
// import { uniqueId } from "lodash";

const Follower = ({ userId , setStartChatWith ,setSelectedContact , groupMinaml  }: { 
  userId: number  , 
  setSelectedContact:Dispatch<SetStateAction<Contact | null>>  ,
  groupMinaml ?: boolean

  setStartChatWith  :React.Dispatch<React.SetStateAction<followerType | null>>


} ) => {
  const {
    data: dataFollower,
    isFetching: FetchingFollower,
    isLoading: LoadingFollower,
  } = useGetFollowerNotchatQuery({
    userId: userId,
  });


  const {ChoseMemberGroup ,setChoseMemberGroup} = useChoseMemberGroup()



  


  return (
    <div>
      <h3>Followers</h3>
      {dataFollower &&
        dataFollower.map((contact, index) => {
          const isInChoseMemberGroup = ChoseMemberGroup?.findIndex((user)=> user.id === contact.user?.id) !== -1

          const profile = contact.profilePicture?.find((img: any) => {
            return img.type === "profile";
          });

          return (
            
              <div
              key={contact.user.id}
                className="flex items-center gap-3 p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer mb-2"
                onClick={() => {
                  setStartChatWith(contact);
                  setSelectedContact(null)
                  if(groupMinaml){


                      setChoseMemberGroup((prev)=>{
                        if(prev && contact.user){
                          
                          if(isInChoseMemberGroup){
                            return prev.filter((user) => user.id !== contact.user.id)
                          }else {
    
                           return [...prev, {
                            id: contact.user.id,
                            email :contact.user.email,
                            first_name : contact.user.first_name, 
                            last_name : contact.user.last_name,
                            user_name : contact.user.user_name,
                            profile : {
                              profilePictures : contact.profilePicture
                            }
                            
                           } as UserWithPic ]
                          }
                          }
                        else {
                          return []
                        }
                      }
                      )
                      setStartChatWith(null);
                      // setSelectedContact(contact?.reciver || null );
                      // setChat(contact.chat.id);
                    
                    
                  }
                  // AddChat(contact.user.id);
                  //   setSelectedContact(contact.reciver)
                  //   setChat(contact.chat.id)
                  //   document.querySelector('[data-state="active"][data-value="messages"]')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Avatar>
                  {!profile ? (
                    <AvatarFallback>
                      {contact.user.first_name[0]}
                    </AvatarFallback>
                  ) : (
                    <BluredImage
                      alt={
                        contact.user?.first_name + " " + contact.user?.last_name
                      }
                      className="w-10 h-10 rounded-full"
                      imageUrl={profile?.secure_url || ""}
                      height={profile?.height || 0}
                      quality={40}
                      width={profile?.width || 0}
                      blurhash={profile?.HashBlur}
                    />
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {contact.user?.first_name + " " + contact.user?.last_name}
                  </p>
                  {/* <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {msg}
                    </p> */}
                </div>
                <div className="flex flex-col items-end gap-3">
                  {/* <span className="text-xs text-gray-500  dark:text-gray-400">
                      {date}
                    </span> */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status === "SENT" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></span>
                </div>
              </div>

          );
        })}
    </div>
  );
};

export default Follower;
