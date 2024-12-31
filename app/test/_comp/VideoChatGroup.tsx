
import React, { useEffect, useMemo, useRef, useState } from "react";
import { VideoChatStatus } from "@prisma/client";
import { LoaderCircle, TextSelect } from "lucide-react";
import { useGroupWebRTC } from "@/hooks/useWebRtcGroup";
import { useVideoCall } from "@/hooks/useVideoCall";
import { Button } from "@/components/ui/button";
import VideoChatGroupRtc from "./videoChatGroupRtc";
import { videoChatWithParticipant } from "@/store/api/apiVideoCall";
import { unknown } from "zod";
import LiveKitRoom from "@/app/_components/LiveKitRoom";

interface GroupVideoChatProps {
  roomId: number;
  currentUserId: number;
  // participants: number[];
  chatId: number;
  userName: string
}

export const GroupVideoChat: React.FC<GroupVideoChatProps> = ({
  roomId,
  currentUserId,
  // participants,
  userName,
  chatId,
}) => {
 

  const { activeCall, startVideoCall, joinVideoCall, endVideoCall, isLoading } =
    useVideoCall(chatId, currentUserId, roomId);

  const Memoized = useMemo(()=>{

      if(activeCall && activeCall.VideoChatParticipant.length) {

        const id =   activeCall.VideoChatParticipant.find((particpent) =>{
          return currentUserId === particpent.userId
        })?.userId
        if(id){

          return id
        }else{ 
          return null
        }
    }else{ 
      return null
    }
  },[activeCall, currentUserId])

  console.log({id :activeCall?.id})
  if (isLoading) {
    return <LoaderCircle className="animate-spin w-4 h-4" />;
  }
  if(activeCall && !Memoized ){

    return       <div className="flex space-x-4">
              <Button onClick={()=>joinVideoCall(activeCall.id )}>join Call</Button>
             
          </div>
  }
if(!activeCall){
  return       <div className="flex space-x-4">
           {!activeCall && (
            <Button onClick={startVideoCall}>Start Call</Button>
           )}
        </div>
}
  if(!currentUserId || !Memoized ||    !roomId){
      return   <TextSelect className="animate-indeterminate-bar w-4 h-4" />;
  }

    



  return (
<LiveKitRoom

roomId={roomId}
user={userName}
/>


  );
};
