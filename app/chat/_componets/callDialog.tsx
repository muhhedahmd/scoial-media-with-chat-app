// "use client";

// import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   ChevronDown,
//   ChevronUp,
//   Mic,
//   MicOff,
//   Phone,
//   Video,
//   VideoOff,
// } from "lucide-react";
// import LiveKitRoom from "@/app/_components/LiveKitRoom";
// import supabase from "@/lib/Supabase";
// import { useVideoCall } from "@/context/CallContext";
// import { userResponse } from "@/store/Reducers/mainUser";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "@/components/ui/use-toast";

// interface VideoCallDialogProps {
//   setOpenCallDialog: Dispatch<SetStateAction<boolean>>;
//   openCallDialog: boolean;
//   roomId: number;
//   token: string;
//   username: string;
// }

// const VideoCallDialog: React.FC<VideoCallDialogProps> = ({
//   setOpenCallDialog,
//   openCallDialog,
//   roomId,
//   token,
//   username,
// }) => {
//   const { activeCall, handleEndCall, isUserLeave } = useVideoCall();
//   const { toast } = useToast();
//   const CachedUser = useSelector(userResponse)!;
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const searchParams = params.get("calling");
//     if (searchParams && +searchParams) {
//       setOpenCallDialog(true);
//     }
//   }, [setOpenCallDialog]);

//   const handleCloseDialog = () => {
//     const params = new URLSearchParams(window.location.search);
//     const searchParams = params.get("calling");

//     if (searchParams) {
//       params.delete("calling");
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);
//     }
//     setOpenCallDialog(false);
//     if (activeCall) {
//       const channel = supabase.channel(`video_call_${activeCall.chatId}`);
//       channel.send({
//         type: "broadcast",
//         event: "video_call_leave_call",
//         payload: {
//           type: "user leave",
//           userName: CachedUser.user_name,
//           id: CachedUser.id,
//         },
//       });
//     }
//   };

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null;
//     console.log({
//       timeoutId,
//     });
//     const handleMissedCall = async () => {
//       if (activeCall && activeCall.status === "PENDING") {
//         // setIsMissed(true);
//         await handleEndCall("MISSED").then((res) => {
//           console.log("call is missed", res);
//           toast({
//             title: "Call Missed",
//             description: "The call has timed out.",
//             variant: "destructive",
//           });
//         });
//       }
//     };

//     if (activeCall && activeCall.status === "PENDING") {
//       // const now = Date.now();
//       // const createdTime = +new Date(activeCall.createdAt);
//       // const timeElapsed = now - createdTime;
//       // const timeLeft = Math.max(100000 - timeElapsed, 0); // 60 seconds (60000ms) minus time elapsed
//       // console.log({
//       //   timeElapsed ,
//       //   createdTime ,
//       //   now ,
//       //   timeLeft
//       // })
//       // console.log({
//       //   timeoutId,
//       //   timeLeft,
//       // });
//       // if (true) {
//         timeoutId = setTimeout(handleMissedCall, 60000);
//       // } else {
//       //   console.log("timeoutId" ,timeoutId)
//       //   timeoutId = setTimeout(handleMissedCall , timeLeft);
//       // }
//     }

//     return () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//       // setIsMissed(false);
//     };
//   }, [activeCall]);

//   return (

//     // <Dialog open={openCallDialog}
//     // onOpenChange={handleCloseDialog}>
//     //   <DialogContent className="sm:max-w-[100vw] sm:max-h-[100vh] p-1">
//     //     <DialogHeader className="pt-0 pl-0">
//     //       {/* <DialogTitle>Video Call</DialogTitle> */}
//     //     </DialogHeader>
//     //     <div className="relative w-full h-sull bg-gray-900">
//     //       <LiveKitRoom
//     //         roomId={roomId}
//     //         user={username}
//     //         // video={isVideoEnabled}
//     //       />
//     //     </div>
//     //   </DialogContent>
//     // </Dialog>
//   );
// };

// export default VideoCallDialog;

// {
//   /* <div
//   className={`absolute bottom-6 left-1/2 transform backdrop-blur-md shadow-xl rounded-xl px-5 pt-1 py-3 -translate-x-1/2 flex flex-col items-center space-y-2 transition-all duration-300 ease-in-out ${
//     isMenuExpanded ? "h-auto" : "h-12 overflow-hidden"
//   }`}
// >
//   <Button
//     variant="ghost"
//     size="sm"
//     className="w-5 h-5 text-white hover:bg-gray-700"
//     onClick={toggleMenu}
//   >
//     {isMenuExpanded ? (
//       <ChevronDown className="w-5 h-5" />
//     ) : (
//       <ChevronUp className="w-5 h-5" />
//     )}
//   </Button>
//   {/* {isMenuExpanded && (
//     <>
//       <div className="flex w-full justify-start items-center space-x-4">
//         <Button
//           variant="outline"
//           size="icon"
//           className="rounded-full bg-gray-800 hover:bg-gray-700"
//           onClick={toggleAudio}
//         >
//           {isMuted ? (
//             <MicOff className="h-6 w-6 text-red-500" />
//           ) : (
//             <Mic className="h-6 w-6 text-white" />
//           )}
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           className="rounded-full bg-gray-800 hover:bg-gray-700"
//           onClick={toggleVideo}
//         >
//           {isVideoEnabled ? (
//             <Video className="h-6 w-6 text-white" />
//           ) : (
//             <VideoOff className="h-6 w-6 text-red-500" />
//           )}
//         </Button>
//         <Button
//           variant="destructive"
//           size="icon"
//           className="rounded-full"
//           onClick={handleCloseDialog}
//         >
//           <Phone className="h-6 w-6 rotate-[135deg]" />
//         </Button>
//       </div>
//     </>
//   )} */
// }
// // </div>

"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
} from "lucide-react";
import LiveKitRoom from "@/app/_components/LiveKitRoom";
import supabase from "@/lib/Supabase";
import { useVideoCall } from "@/context/CallContext";
import { userResponse } from "@/store/Reducers/mainUser";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

interface VideoCallDialogProps {
  setOpenCallDialog: Dispatch<SetStateAction<boolean>>;
  openCallDialog: boolean;
  roomId: number;
  token: string;
  username: string;
}

const VideoCallDialog: React.FC<VideoCallDialogProps> = ({
  setOpenCallDialog,
  openCallDialog,
  roomId,
  token,
  username,
}) => {
  const { activeCall, handleEndCall, isUserLeave } = useVideoCall();
  const { toast } = useToast();
  const CachedUser = useSelector(userResponse)!;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParams = params.get("calling");
    if (searchParams && +searchParams) {
      setOpenCallDialog(true);
    }
  }, [setOpenCallDialog]);

  useEffect(() => {
    if (openCallDialog) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: "-100%" },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: "-100%",
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setOpenCallDialog(false),
      });
    }
  }, [openCallDialog, setOpenCallDialog]);

  const handleCloseDialog = () => {
    const params = new URLSearchParams(window.location.search);
    const searchParams = params.get("calling");

    if (searchParams) {
      params.delete("calling");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (activeCall) {
      const channel = supabase.channel(`video_call_${activeCall.chatId}`);
      channel.send({
        type: "broadcast",
        event: "video_call_leave_call",
        payload: {
          type: "user leave",
          userName: CachedUser.user_name,
          id: CachedUser.id,
        },
      });
    }
    setOpenCallDialog(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const handleMissedCall = async () => {
      if (activeCall && activeCall.status === "PENDING") {
        await handleEndCall("MISSED").then(() => {
          toast({
            title: "Call Missed",
            description: "The call has timed out.",
            variant: "destructive",
          });
        });
      }
    };

    if (activeCall && activeCall.status === "PENDING") {
      timeoutId = setTimeout(handleMissedCall, 60000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeCall, handleEndCall, toast]);

  return (
    openCallDialog && (
      <div
        ref={modalRef}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="relative w-full h-full bg-gray-900">
          <Button
            variant={"ghost"}
            onClick={handleCloseDialog}
            className="absolute top-4 right-4 text-white"
          >
            Close
          </Button>
          <div 
          className="h-screen w-screen bg-red-500"
          />
          <LiveKitRoom roomId={roomId} user={username} />
      <div>
  
      </div>
          <div
            className={`absolute bottom-6 left-1/2 transform backdrop-blur-md shadow-xl rounded-xl px-5 pt-1 py-3 -translate-x-1/2 flex flex-col items-center space-y-2 transition-all duration-300 ease-in-out`}
          >
          
          </div>
        </div>
      </div>
    )
  );
};

export default VideoCallDialog;
