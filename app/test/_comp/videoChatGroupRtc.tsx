import { Button } from "@/components/ui/button";
import { useVideoCall } from "@/hooks/useVideoCall";
import { useGroupWebRTC } from "@/hooks/useWebRtcGroup";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";

const VideoChatGroupRtc = ({
  roomId,
  currentUserId,
  currentUserIdinVideoChatPartcipentId,
  chatId,
}: {
  chatId: number;
  roomId: number;
  currentUserId: number;
  currentUserIdinVideoChatPartcipentId: number;
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const { activeCall, startVideoCall, joinVideoCall, endVideoCall, isLoading } =
    useVideoCall(chatId, currentUserId, roomId);
  const {
    localStream,
    peers,
    startCall,
    joinCall,
    leaveCall,
    isCallStarted,
    activeSpeaker,
  } = useGroupWebRTC(
    roomId,
    currentUserIdinVideoChatPartcipentId
    // , participants
  );

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleStartCall = async () => {
    const newCall = await startVideoCall();
    console.log({
      newCall,
    });
    if (newCall && newCall.VideoChatParticipant.length) {
      console.log({
        newCall,
      });
      await startCall(newCall.VideoChatParticipant);
    }
  };

  useEffect(() => {
    if (activeCall && activeCall.VideoChatParticipant) {

      (async () => {
        // const join = await joinVideoCall(activeCall.id);
        joinCall(activeCall?.VideoChatParticipant.filter((user)=>user.id!== currentUserId));
        // if (join && join!.userId!);
      })();
    }
  }, [activeCall, joinCall, joinVideoCall ,currentUserId]);

  const handleJoinCall = async () => {
    if (activeCall) {
      const join = await joinVideoCall(activeCall.id);
      if (join && join!.userId!) {
        joinCall(activeCall?.VideoChatParticipant);
      }
    }
  };

  const handleLeaveCall = async () => {
    if (activeCall) {
      await endVideoCall(activeCall.id);
      leaveCall();
    }
  };

  if (isLoading) {
    return <LoaderCircle className="animate-spin w-4 h-4" />;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div
          className={`col-span-${activeSpeaker === currentUserId ? "2" : "1"}`}
        >
          <h3 className="text-lg font-semibold">
            Local Stream {activeSpeaker === currentUserId && "(Active Speaker)"}
          </h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-auto bg-gray-200 rounded-lg ${
              activeSpeaker === currentUserId ? "border-4 border-blue-500" : ""
            }`}
          />
        </div>
        {peers.map((peer, idx) => (
          <div
            key={idx}
            className={`col-span-${activeSpeaker === peer.id ? "2" : "1"}`}
          >
            <h3 className="text-lg font-semibold">
              Peer {peer.id} {activeSpeaker === peer.id && "(Active Speaker)"}
            </h3>

            <video
              ref={(el) => {
                if (el && peer.stream) el.srcObject = peer.stream;
              }}
              autoPlay
              playsInline
              className={`w-full h-auto bg-gray-200 rounded-lg ${
                activeSpeaker === peer.id ? "border-4 border-blue-500" : ""
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        {!isCallStarted && !activeCall && (
          <Button onClick={handleStartCall}>Start Call</Button>
        )}
        {activeCall && <Button onClick={handleJoinCall}>Join Call</Button>}
        {isCallStarted && (
          <Button onClick={handleLeaveCall} variant="destructive">
            Leave Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoChatGroupRtc;
