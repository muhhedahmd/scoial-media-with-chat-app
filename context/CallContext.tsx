import { useToast } from "@/components/ui/use-toast";
import { useWebRTC } from "@/hooks/useWebRtc";
import supabase from "@/lib/Supabase";
import {
  endVideoCall,
  getActiveVideoCall,
  joinVideoCall,
  startVideoCall,
} from "@/lib/videoCalls";
import { userResponse } from "@/store/Reducers/mainUser";
import { Chat, VideoChat } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useSelector } from "react-redux";

interface VideoCallContextType {
  activeCall: VideoChat | null;
  isCalling: VideoChat | null;
  // localStream: MediaStream | null;
  // remoteStream: MediaStream | null;
  isCallStarted: boolean;
  handleJoin: () => Promise<void>;
  handleStartCall: (otherUserId: number) => Promise<void>;
  handleEndCall: (type ?: string) => Promise<void>;
  room: number | null;
  OpenCallDialog: boolean;
  setOpenCallDialog: Dispatch<SetStateAction<boolean>>;
  setisDialogOpen: Dispatch<SetStateAction<boolean>>;

  setgetIsSenderandReciverConnected: React.Dispatch<
    React.SetStateAction<{
      sender: boolean;
      receiver: boolean;
    }>
  >;
  isUserLeave: boolean
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(
  undefined
);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error("useVideoCall must be used within a VideoCallProvider");
  }
  return context;
};

interface VideoCallProviderProps {
  children: React.ReactNode;
  chat: Chat | null;
  currentUser: { id: number };
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({
  children,
  chat,
  currentUser,
}) => {
  const [activeCall, setActiveCall] = useState<VideoChat | null>(null);
  const [startedJoin, setStartedJoin] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<VideoChat | null>(null);
  const [isUserLeave , setIsUserLeave ] =useState(false)
  // const [LocalStreamDialog, setLocalStreamDialog] = useState<boolean>(false);
  const [isMissed, setIsMissed] = useState(false);
  // const [isDialogOpen, setisDialogOpen] = useState(false);
  const [OpenCallDialog, setOpenCallDialog] = useState(false);

  const cachedUser = useSelector(userResponse);
  const [getIsSenderandReciverConnected, setgetIsSenderandReciverConnected] =
    useState({
      sender: false,
      receiver: false,
    });
  const { toast } = useToast();
  useEffect(() => {
    if (!chat?.id || !currentUser?.id) return;
    const fetchActiveCall = async () => {
      try {
        const res = await getActiveVideoCall(chat.id);
        if (res) {
          console.log({ res });
          setActiveCall(res);
          if (res.status === "PENDING" && res.senderId !== currentUser?.id) {
            setIsCalling(res);
          } else if (res.status === "ONGOING") {
            setStartedJoin(true);
            // joinWebRTCCall();
          }
        }
      } catch (error) {
        console.error("Error fetching active call:", error);
      }
    };

    fetchActiveCall();
  }, [chat?.id, currentUser?.id]);

  const handleEndCall = useCallback(
    async (type?: string) => {
      if (!chat?.id) return;
      if (activeCall) {
        try {
          setStartedJoin(false);
          const endedCall = await endVideoCall(activeCall.id);
          
          const channel = supabase.channel(`video_call_${chat?.id}`);
          channel.send({
            type: "broadcast",
            event: "video_call_end",
            payload: {
              type: type || "ENDED",
              id: activeCall.id,
            },
          }).then(()=>{

            setActiveCall(null);
            setOpenCallDialog(false)
          })
        } catch (error) {
          console.error("Error ending video call:", error);
        }
      }
    },
    [activeCall, chat?.id]
  );

  useEffect(() => {
    const channel = supabase.channel(`video_call_${chat?.id}`);
    const handleVideoCallLeave = async (payload: any) => {
      try {
        const { type, userName, id } = payload.payload as any;
        console.log({ getIsSenderandReciverConnected });

        if (type === "user leave") {
          if(id !== cachedUser?.id) {
            setIsUserLeave(true)
          }
          toast({
            variant: "default",
            title: id === cachedUser?.id ? "You" : userName,
            description: `${id === cachedUser?.id ? "You" : userName} left the call`,
          });
          if (activeCall) {
            setgetIsSenderandReciverConnected((prev) => ({
              ...prev,
              [id === activeCall.senderId ? 'sender' : 'receiver']: false
            }));

            if (!getIsSenderandReciverConnected.receiver && !getIsSenderandReciverConnected.sender) {
              await handleEndCall();
              setIsCalling(null);
              setActiveCall(null);
              setOpenCallDialog(false)
                          toast({
                variant: "default",
                title: "Call Ended",
                description: "All participants have left the call",
              });
            }
          }
        } else if (type === "user Join" && activeCall) {

          if(id !== cachedUser?.id) {
            setIsUserLeave(false)
          }
          setgetIsSenderandReciverConnected((prev) => ({
            ...prev,
            [id === activeCall.senderId ? 'sender' : 'receiver']: true
          }));

          if (getIsSenderandReciverConnected.receiver && getIsSenderandReciverConnected.sender) {
            toast({
              variant: "default",
              title: "Call Started",
              description: "All participants have joined the call",
            });
          }

          toast({
            variant: "default",
            title: id === cachedUser?.id ? "You" : userName,
            description: `${id === cachedUser?.id ? "You" : userName} joined the call`,
          });
        }
      } catch (error) {
        console.error("Error handling video call leave event:", error);
      }
    };

    channel
      .on("broadcast", { event: "video_call_update" }, async ({ payload }) => {
        try {
          const { call } = payload;
          setActiveCall(call as VideoChat);
          console.log("Broadcast received!", payload);

          if (call.status === "PENDING" && call.senderId !== currentUser?.id) {
            setIsCalling(call);
          } else if (call.status === "ONGOING" && !startedJoin) {
            setStartedJoin(true);
            // joinWebRTCCall();
          }
        } catch (error) {
          console.error(error);
        }
      })
      .on(
        "broadcast",
        {
          event: "video_call_end",
        },
        async ({ payload }) => {
          try {
            const { id, type } = payload;

            const res = await endVideoCall(id);

            if (res) {
              setIsCalling(null);
              setActiveCall(null);
              // endWebRTCCall();
            }
          } catch (error) {
            console.error(error);
          }
        }
      )
      .on("broadcast", { event: "video_call_leave_call" }, handleVideoCallLeave)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to video call changes!");
        }
      });

    const handleBeforeUnload = () => {
      if (activeCall) {
        channel.send({
          type: "broadcast",
          event: "video_call_leave_call",
          payload: {
            type: "user leave",
            userName: cachedUser?.user_name || "Unknown user",
            id: cachedUser?.id,
          },
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      channel.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeCall, cachedUser?.id, cachedUser?.user_name, chat?.id, currentUser?.id, getIsSenderandReciverConnected, handleEndCall, startedJoin, toast]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeCall) {
        const channel = supabase.channel(`video_call_${chat?.id}`);
        channel.send({
          type: "broadcast",
          event: "video_call_leave_call",
          payload: {
            type: "user leave",
            userName: cachedUser?.user_name || "Unknown user",
            id: cachedUser?.id,
          },
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeCall, cachedUser?.id, cachedUser?.user_name, chat?.id]);

  const handleJoin = async () => {
    if (activeCall) {
      try {
        if (activeCall.status === "PENDING") {
          setStartedJoin(true);
          const updatedCall = await joinVideoCall(
            activeCall.id,
            currentUser?.id
          );
          // joinWebRTCCall();
          setIsCalling(null);
          setActiveCall(updatedCall);
          const channel = supabase.channel(`video_call_${chat?.id}`);
          channel.send({
            type: "broadcast",
            event: "video_call_update",
            payload: {
              call: updatedCall,
            },
          });
          channel.send({
            type: "broadcast",
            event: "video_call_leave_call",
            payload: {
              type :"user Join" ,
              userName : cachedUser?.user_name ,
              id : cachedUser?.id
            },
          });
        } else {
          setStartedJoin(true);

          // joinWebRTCCall();

          setIsCalling(null);
        }
      } catch (error) {
        console.error("Error joining video call:", error);
      }
    }
  };

  const handleStartCall = async (otherUserId: number) => {
    if (!chat?.id || !currentUser?.id || !otherUserId) return;
    try {
      const newCall = await startVideoCall(
        chat.id,
        currentUser?.id,
        otherUserId
      );
      setActiveCall(newCall);
      // startWebRTCCall();
      const channel = supabase.channel(`video_call_${chat?.id}`);
      channel.send({
        type: "broadcast",
        event: "video_call_update",
        payload: {
          call: newCall,
        },
      });
    } catch (error) {
      console.error("Error starting video calsl:", error);
    }
  };

  // useEffect(() => {
    
  //   const time = 60; // 1min
  //   const interval = setInterval(() => {
  //     if (activeCall && activeCall.status === "PENDING") {
  //       const now = Date.now();
  //       const createdtime = +activeCall.createdAt;
  //       const callTime = now - createdtime;
  //       if (callTime > time * 1000) {
  //         setIsMissed(true);
  //         handleEndCall("MISSED");
  //         clearInterval(interval);
  //       }
  //     }
  //   });
  //   return () => {
  //     clearInterval(interval);

  //     setIsMissed(false);
  //   };
  // }, [activeCall, handleEndCall]);
  // dead call after amount of Time if both user out



  const value = {
    activeCall,
    isCalling,
    handleJoin,
    handleStartCall,
    handleEndCall,
    room: chat?.roomId || null,
    setgetIsSenderandReciverConnected,
    OpenCallDialog,
    setOpenCallDialog,
    isUserLeave
  } as VideoCallContextType;

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};
// setVideoSettings,
// videoSettings,

// localStream,
// remoteStream,
// isCallStarted,

