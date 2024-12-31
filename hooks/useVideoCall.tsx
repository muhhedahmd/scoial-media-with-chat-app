import { useState, useCallback, useEffect } from "react";
import {
  VideoChat,
  VideoChatParticipant,
  VideoChatStatus,
} from "@prisma/client";
import supabase from "@/lib/Supabase";
import {
  useVideoCallActiveGroupMutation,
  useVideoCallJoinGroupMutation,
  useVideoCallStartGroupMutation,
  useVidoCallLeaveGroupMutation,
  videoChatWithParticipant,
} from "@/store/api/apiVideoCall";
import { number } from "zod";
import { getActiveVideoCallGroup } from "@/lib/videoCalls";
import prisma from "@/lib/prisma";

export function useVideoCall(chatId: number, userId: number, roomId: number) {
  const [activeCall, setActiveCall] = useState<{
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
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [
    createVideoCall,
    { data: createVideoCallData, isError: isErrorcreateVideoCall },
  ] = useVideoCallStartGroupMutation();
  const [
    VideoCallJoinGroup,
    { data: VideoCallJoinData, isError: isErrorVideoCallJoin },
  ] = useVideoCallJoinGroupMutation();
  const [
    VideoCallActiveGroup,
    { data: VideoCallActiveData, isError: isErrorVideoCallActive },
  ] = useVideoCallActiveGroupMutation();
  const [
    VidoCallLeaveGroup,
    { data: VidoCallLeaveGroupData, isError: isErrorVidoCallLeaveGroupe },
  ] = useVidoCallLeaveGroupMutation();

  useEffect(() => {
    const fetchActiveCall = async () => {
      try {
        const res = await getActiveVideoCallGroup(chatId);
        if (res) {
          console.log({ res });
          // setActiveCall(res);
          if (res.status === "PENDING") {
            // setIsCalling(res);
          } else if (res.status === "ONGOING") {
            // setStartedJoin(true);
            // joinCall();
          }
        }
      } catch (error) {
        console.error("Error fetching active call:", error);
      }
    };
  }, [chatId]);

  useEffect(() => {
    const channel = supabase.channel(`video-chat-group-${roomId}`);
    channel
      .on(
        "broadcast",
        { event: "video_call_find_active" },
        async ({ payload }) => {
          try {
            const { call } = payload as {
              call :videoChatWithParticipant
            } ;
            if(call?.endTime)
            {

              setActiveCall(null);
              console.log("Broadcast received!", { call, activeCall });
            }
            else{
              setActiveCall(call);
            }
          } catch (error) {
            console.error(error);
          }
        }
      )
      .on(
        "broadcast",
        {
          event: "video_call_leave",
        },
        async ({ payload }) => {
          try {
            const { leave } = payload as {
              leave: videoChatWithParticipant;
            };
            if (leave?.endTime) {
              setActiveCall(null);
            }

            setActiveCall(leave);
          } catch (error) {
            console.error(error);
          }
        }
      )
      .on(
        "broadcast",
        {
          event: "video_call_start",
        },
        async ({ payload }) => {
          const { call } = payload as {
            call: typeof activeCall;
          };
          setActiveCall(call);
        }
      )
      .on(
        "broadcast",
        {
          event: "video_call_join",
        },
        async ({ payload }) => {
          try {
            const { call } = payload;

            setActiveCall((prev) => {
              if (prev) {
                return {
                  ...prev,
                  VideoChatParticipant: prev.VideoChatParticipant
                    ? [...prev.VideoChatParticipant, call]
                    : [call],
                };
              } else {
                return prev;
              }
            });
          } catch (error) {}
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to video call changes!");
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [activeCall, chatId, roomId]);

  const fetchActiveCall = useCallback(async () => {

    

    try {
      setIsLoading(true);
      // create channel
      const channel = supabase.channel(`video-chat-group-${roomId}`);
      await VideoCallActiveGroup({
        chatId,
        roomId,
      })
        .unwrap()
        .then((res) => {
          channel.send({
            type: "broadcast",
            event: "video_call_find_active",
            payload: {
              call: res,
            },
          });
        });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [VideoCallActiveGroup, chatId, roomId]);

  useEffect(() => {
    fetchActiveCall();
  }, [fetchActiveCall]);

  const startVideoCall = useCallback(async () => {
    try {
  return  await createVideoCall({
        chatId: chatId,
      })
        .unwrap()
        .then((data) => {
          console.log(
            "Video call created successfully with id: ",
            data
          )
          setActiveCall(data)
          const channel = supabase.channel(`video-chat-group-${roomId}`);
          channel.send({
            type: "broadcast",
            event: "video_call_start",
            payload: {
              call: data,
            },

          });
          return data;
        });

    } catch (error) {
      console.error("Error starting video call:", error);
    }
    // const { data, error } = await supabase
    //   .from('VideoChat')
    //   .insert({
    //     chatId,
    //     senderId: userId,
    //     status: VideoChatStatus.PENDING,
    //   })
    //   .select()
    //   .single();

    // if (error) {
    //   console.error('Error starting video call:', error);
    //   return null;
    // }
  }, [createVideoCall, chatId, roomId, createVideoCallData]);

  const joinVideoCall = useCallback(
    async (
      videoChatId: number
    ): Promise<VideoChatParticipant | null | undefined> => {
      try {
        await VideoCallJoinGroup({
          videoChatId: videoChatId,
        })
          .unwrap()
          .then((data) => {
            setActiveCall((prev) => {
              if (prev) {
                return {
                  ...prev,
                  VideoChatParticipant: prev.VideoChatParticipant
                    ? [...prev.VideoChatParticipant, data]
                    : [data],
                };
              } else {
                return prev;
              }
            });
          });
        // setActiveCall(data);
        const channel = supabase.channel(`video-chat-group-${roomId}`);
        channel.send({
          type: "broadcast",
          event: "video_call_join",
          payload: {
            join: VideoCallJoinData,
          },
        });

        return VideoCallJoinData;
      } catch (error) {
        console.error("Error joining video call:", error);
        return null;
      }
    },
    [VideoCallJoinData, VideoCallJoinGroup, roomId]
  );

  const endVideoCall = useCallback(
    async (videoChatId: number) => {
      try {
        await VidoCallLeaveGroup({
          chatId: chatId,
          // participantId : 0,
          videoCallId: videoChatId,
        })
          .unwrap()
          .then((res) => {
            if (!res) return;
            const channel = supabase.channel(`video-chat-group-${roomId}`);
            channel.send({
              type: "broadcast",
              event: "video_call_leave",
              payload: {
                leave: res,
              },
            });
          });

        setActiveCall(null);
        return VidoCallLeaveGroupData;
      } catch (error) {
        console.log(error)
      }
    },
    [VidoCallLeaveGroup, VidoCallLeaveGroupData, chatId, roomId]
  );

  return {
    activeCall,
    isLoading,
    startVideoCall,
    joinVideoCall,
    endVideoCall,
  };
}
