
import { VideoChat, VideoChatParticipant, VideoChatStatus } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export  type  videoChatWithParticipant =  {
  id: number;
  startTime: Date;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  receiverId: number | null;
  senderId: number;
  chatId: number;
  status: VideoChatStatus;
  VideoChatParticipant: VideoChatParticipant[] | [];
} | null
export const apiVideoCall = createApi({
  reducerPath: "VideoCall",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    videoCallStartGroup : build.mutation<videoChatWithParticipant ,{

      chatId :number
    }>({

        query: ({chatId}) => {
            return {
                url : "/chat/video-call-start-group",
                body:{
                    chatId :chatId
                } ,
                method :"POST"
            }
        }
    }),
    videoCallJoinGroup : build.mutation< VideoChatParticipant,{videoChatId: number}>({

      query: ({videoChatId}) => {
        return {
          url: "/chat/video-call-join-group",
          method: "POST",
          body:{
            videoChatId
          }
        }
      }

    }),
    videoCallActiveGroup : build.mutation< 

    videoChatWithParticipant
    ,{roomId:number, chatId:number}>({

      query: ({roomId, chatId}) => {
        return {
          url: "/chat/video-call-get-active-group",
          method: "POST",
          body:{
            roomId, chatId
          }
        }
      }

    }),
    vidoCallLeaveGroup : build.mutation<videoChatWithParticipant , {
      chatId : number,
      videoCallId :number,
      // participantId :number
    }>({
      query:({
        chatId,
        videoCallId ,
        // participantId
      })=>{
        return{
          url: "/chat/video-call-leave-group",
          method: "PUT",
          body:{
            chatId, videoCallId
          }


        }
      }
    })
  }),
});

export const {useVideoCallStartGroupMutation  , useVideoCallActiveGroupMutation , useVideoCallJoinGroupMutation , 
  useVidoCallLeaveGroupMutation
} =
apiVideoCall;
