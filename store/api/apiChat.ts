import { FixedContract, UserWithPic } from "@/app/api/chat/contacts-users/route";
import { MessageOfChatTypePrivate } from "@/app/api/chat/get-message/route";
import supabase from "@/lib/Supabase";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { followApi } from "./apiFollows";
import {  ChatType, Message, MessageLinks, MessageMedia, ProfilePicture, VideoChat } from "@prisma/client";
import { ChatMediaTabsType } from "@/app/api/chat/chat-media-tabs/route";
import prisma from "@/lib/prisma";
import { FixedContractGroup, startChatGroupReq } from "@/app/api/chat/start-chat-group/route";





type  LinksTab = {
  "media"  : MessageLinks[] | []
  hasMore : boolean
}
type  imageViedoTab = {
  media : MessageMedia[] | []
  hasMore : boolean
}
type  ImagesTab = {
  "media"  : MessageMedia[] | []
  hasMore : boolean
}
type  videoTab = {
  "media"  : MessageMedia[] | []
  hasMore : boolean
}
type  othersTab = {
  "media"  : MessageMedia[] | []
  hasMore : boolean
}

type  audioTab = {
  "media"  : MessageMedia[] | []
  hasMore : boolean
}



export type FixedResponseTaps = {
link : LinksTab ,
'video&image' : imageViedoTab ,
image : ImagesTab ,
video : videoTab ,
others : othersTab ,
audio : audioTab ,

}



export const ChatApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API!,
  }),
  endpoints: (build) => ({
    getMsgMedia: build.query<MessageMedia[], { msg_id: number }>({
      query: ({ msg_id }) => ({
        url: `chat/chat-media?Msg_id=${msg_id}`,
      }),
    }),
    getContacts: build.query<FixedContract[] & FixedContractGroup[]  , {
      skip ?: number ,
      take ?: number  ,
      type ?: ChatType,
    }>({
      query: ({
        skip ,
        take, 
        type, 
      }) => ({
        url: "chat/contacts-users",
        params:  {
            skip ,
            take ,
            type ,

          }
        

      }),
    }),
 

    getMediaTabs: build.query<FixedResponseTaps , {
      chatId: number;
      skip: number;
      take: number;
      type: ChatMediaTabsType;
    }>({
      query: ({ chatId, skip, take, type }) => ({
        url: `chat/chat-media-tabs`,
        params: { chatId, skip, take, type },
      }),
      transformResponse: (response: MessageLinks[] | MessageMedia[], _meta, arg) => {
    
        const fixed  : FixedResponseTaps = {
          link : { media : arg.type ===  "link"  ? response as MessageLinks[] : [] , 
            hasMore :  arg.type ===  "link"  &&  response.length  < 10 ? false : true , 
           },
           "video&image" :{  
             media : arg.type ===  "video&image"  ? response as MessageMedia[] : [],
            hasMore :  arg.type ===  "video&image"  &&  response.length  < 10 ? false : true , 
          },
           "image" :{ media : arg.type ===  "image"  ? response as MessageMedia[] : [],
            hasMore :  arg.type ===  "image"  &&  response.length  < 10 ? false : true , 
          },
           "video" :{ media : arg.type ===  "video"  ? response as MessageMedia[] : [],
            hasMore :  arg.type ===  "video"  &&  response.length  < 10 ? false : true , 
          },
           "others" :{ media : arg.type ===  "others"  ? response as MessageMedia[] : [],
            hasMore :  arg.type ===  "others"  &&  response.length  < 10 ? false : true , 
          },
           "audio" :{ media : arg.type ===  "audio"  ? response as MessageMedia[] : [],
            hasMore :  arg.type ===  "audio"  &&  response.length  < 10 ? false : true , 
          },
        }
        return fixed
      },
    }),
    // get_msgs
    getChat: build.query<
      MessageOfChatTypePrivate,

      {
        chatId: number;
        skip: number;
        take: number;
      }
    >({
      query: ({ chatId, skip, take }) => ({
        url: `chat/get-message?chatId=${chatId}&skip=${skip}&take=${take}`,

      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {

          console.log("hello")
          const channel = supabase
          .channel(`chat:${arg.chatId}`)
          .on(

            "postgres_changes",

            {
              event: "*",
              schema: "public",
              table: "Message",
              filter: `chatId=eq.${arg.chatId}`,
            },
            async (payload) => {
              console.log("Message payload received:", payload);
              const message = payload.new as Message
        
              // Fetch message media
              const { data: messageMedia, error: mediaError } = await supabase
                .from('MessageMedia')
                .select("*")
                .eq('messageId', message.id)
        
              if (mediaError) {
                console.error("Error fetching message media:", mediaError)
              }
        
              // Fetch sender details with all ProfilePicture properties
              const { data: senderData, error: senderError } = await supabase
                .from('User')
                .select(`
                  id,
                  email,
                  first_name,
                  last_name,
                  user_name,
                  profile:Profile (
                    id,
                    profilePictures:ProfilePicture (
                      *
                    )
                  )
                `)
                .eq('id', message.senderId)
                .single()
                
        
              if (senderError) {
                console.error("Error fetching sender data:", senderError)
              }
        
              // const { data: groupMember, error: groupMemberError } = await supabase
              //   .from('GroupMember')
              //   .select("*")
              //   .eq('userId', message.senderId)
              //   .eq('chatId', message.chatId)
              //   .single()
        
              // if (groupMemberError) {
              //   console.error("Error fetching group member data:", groupMemberError)
              // }
              
              // Construct the full message object
      
              type messagex = (Omit<Message, 'content'> & {
                messageMedia: MessageMedia[] ,
                sender : { id: number;
                email: string;
                first_name: string;
                user_name: string;
                last_name: string;
                profile: {
                  profilePictures: ProfilePicture[] | undefined;
                } | null;
              }
              })
              
              // messagesz=  {

                
              //   messageMedia: MessageMedia[] ,
              //   sender : { id: number;
              //   email: string;
              //   first_name: string;
              //   user_name: string;
              //   last_name: string;
              //   profile: {
              //     profilePictures: ProfilePicture[] | undefined;
              //   } | null;
              // } & Message
              // }
            
              const fullMessage = {
                chatId : message.chatId ,
                createdAt : message.createdAt,
                deletedAt : message.deletedAt,
                encryptedContent : message.encryptedContent,
                iv : message.iv,
                status : message.status,
                likes: message.likes ,
                id : message.id ,
                senderId : message.senderId, 
                receiverId : message.receiverId ,
                updatedAt : message.updatedAt, 
                sender : {
                  email : senderData?.email,
                  first_name : senderData?.first_name ,
                  user_name : senderData?.user_name ,
                  last_name : senderData?.last_name ,
                  id : senderData?.id ,
                  profile : {  
                    profilePictures : senderData?.profile[0].profilePictures ,
                  }
                },
                // sender: senderData,
                messageMedia: messageMedia
              } as  messagex

        
              updateCachedData((draft) => {
                draft.messages.push(fullMessage );
              });
            }
          ).on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'VideoChat',
                filter: `chatId=eq.${arg.chatId}`,
              },
              (payload) => {
                updateCachedData((draft) => {
                  if (payload.eventType === 'INSERT' ) {
                    draft.VideoChat.push( payload.new as VideoChat) 
                  }else if( payload.eventType === 'UPDATE'){
                    const newRes :VideoChat = payload.new as VideoChat
               const idx =     draft.VideoChat.findIndex((vid)=>vid.id === newRes.id as unknown as any) 
                    if(idx !== -1 ){
                      draft.VideoChat[idx] = newRes
                    }

                  } else if (payload.eventType === 'DELETE') {
                    const newRes :VideoChat = payload.new as VideoChat
                    draft.VideoChat.filter((vid)=>vid.id !== newRes.id as unknown as any) ;
                  }
                });
              }
            )
          .subscribe();

          await cacheDataLoaded;
          await cacheEntryRemoved;
          channel.unsubscribe();
          
        } catch (error) {
          console.error("Error in getChat onCacheEntryAdded:", error);
        }
      },

    }),
    sendMsg: build.mutation<null, FormData>({

      query(arg) {
        return {
          url: "chat/send-message",
          method: "POST",
          body: arg,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("Error sending message:", error);
        }
      },
    }),
    startChatGroup : build.mutation<FixedContractGroup ,startChatGroupReq >({
      query : ( arg :startChatGroupReq )=>{
        return {
          url: "chat/start-chat-group",
          method: "POST",
          body : arg
        }
      } ,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(ChatApi.util.updateQueryData("getContacts" , {} , (draft)=>{
            draft.push(data);
          }))
          } catch (error) {
            console.error("Error in startChatGroup onQueryStarted:", error);
          }
        }
    }),

    createChat: build.mutation<
      FixedContract,
      {
        creatorId: number;
        receiverId: number;
      }
    >({

      query: ({ creatorId, receiverId }) => {
        return {
          url: "chat/start-chat-single",
          method: "POST",
          body: {
            creatorId,
            receiverId,
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            ChatApi.util.updateQueryData("getContacts", {}, (draft) => {
              draft.push(data);
            })
          );
          dispatch(
            followApi.util.updateQueryData(
              "getFollowerNotchat",
              undefined as unknown as any,
              (draft) => {
                const findUer = draft.findIndex(
                  (user) => user.user.id === arg.receiverId
                );
                console.log({
                  findUer,
                });
                if (findUer !== -1) {
                  draft.splice(findUer, 1);
                }
              }
            )
          );
        } catch (error) {
          console.error("Error in createChat onQueryStarted:", error);
        }
      },
    }),
    createChatGroup: build.mutation<
      FixedContractGroup,
      FixedContractGroup
    >({
      query: (arg) => {
        return {
          url: "chat/start-chat-group",
          method: "POST",
          body: {
           ...arg
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            ChatApi.util.updateQueryData("getContacts", {}, (draft) => {
              draft.push(data);
            })
          );
          // dispatch(
          //   followApi.util.updateQueryData(
          //     "getFollowerNotchat",
          //     undefined as unknown as any,
          //     (draft) => {
          //       const findUer = draft.findIndex(
          //         (user) => user.user.id === arg.receiverId
          //       );
          //       console.log({
          //         findUer,
          //       });
          //       if (findUer !== -1) {
          //         draft.splice(findUer, 1);
          //       }
          //     }
          //   )
          // );
        } catch (error) {
          console.error("Error in createChat onQueryStarted:", error);
        }
      },
    }),
  }),
});

export const {
  useSendMsgMutation,
  useGetContactsQuery,
  useCreateChatGroupMutation,
  useGetChatQuery,
  useGetMediaTabsQuery,
  useCreateChatMutation,
  useGetMsgMediaQuery,
  useStartChatGroupMutation
} = ChatApi;
