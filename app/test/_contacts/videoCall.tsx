"use client";

import React, { useState, useEffect, memo } from "react";
import {
  startVideoCall,
  endVideoCall,
  joinVideoCall,
  getActiveVideoCall,
} from "@/lib/videoCalls";
import supabase from "@/lib/Supabase";
import { VideoChat, VideoChat as VideoChatType } from "@prisma/client";
import { useWebRTC } from "@/hooks/useWebRtc";

interface VideoChatProps {
  chatId: number;
  currentUserId: number;
  otherUserId: number;
}

export default memo(function VideoChat({
  chatId,
  currentUserId,
  otherUserId,
}: VideoChatProps) {
  const [activeCall, setActiveCall] = useState<VideoChatType | null>(null);
  const [startedJoin, setStartedJoin] = useState<boolean>(false);
  const {
    localStream,
    remoteStream,
    startCall,
    joinCall,
    endCall,
    isCallStarted,
  } = useWebRTC(chatId, currentUserId, otherUserId, startedJoin , false ,false);

  const [isCalling, setIsCalling] = useState<VideoChatType | null>(null);

  useEffect(() => {
    const fetchActiveCall = async () => {
      try {
        const res = await getActiveVideoCall(chatId);
        if (res) {
          console.log({ res });
          setActiveCall(res);
          if (res.status === "PENDING" && res.senderId !== currentUserId) {
            setIsCalling(res);
          } else if (res.status === "ONGOING") {
            setStartedJoin(true);
            joinCall();
          }
        }
      } catch (error) {
        console.error("Error fetching active call:", error);
      }
    };

    fetchActiveCall();

  }, [chatId, currentUserId, joinCall]);

  useEffect(() => {
    const channel = supabase.channel(`video_call_${chatId}`);
    channel
      .on("broadcast", { event: "video_call_update" }, async ({ payload }) => {
        try {
          const { call } = payload;
          setActiveCall(call as VideoChat);
          console.log("Broadcast received!", payload);

          if (call.status === "PENDING" && call.senderId !== currentUserId) {
            setIsCalling(call);
          } else if (call.status === "ONGOING" && !startedJoin) {
            setStartedJoin(true);
            joinCall();
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
              setStartedJoin(false);
              endCall();
            }
          } catch (error) {
            console.error(error);
          }
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
  }, [chatId, currentUserId, joinCall, endCall, startedJoin]);

  const handleJoin = async () => {
    if (activeCall) {
      try {
        setStartedJoin(true);
        const updatedCall = await joinVideoCall(activeCall.id, currentUserId);
        joinCall();
        setIsCalling(null);
        setActiveCall(updatedCall);
        const channel = supabase.channel(`video_call_${chatId}`);
        channel.send({
          type: "broadcast",
          event: "video_call_update",
          payload: {
            call: updatedCall,
          },
        });
      } catch (error) {
        console.error("Error joining video call:", error);
      }
    }
  };

  const handleStartCall = async () => {
    try {
      const newCall = await startVideoCall(chatId, currentUserId, otherUserId);
      setActiveCall(newCall);
      startCall();
      const channel = supabase.channel(`video_call_${chatId}`);
      channel.send({
        type: "broadcast",
        event: "video_call_update",
        payload: {
          call: newCall,
        },
      });
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  const handleEndCall = async () => {
    if (activeCall) {
      try {
        setStartedJoin(false);
        const endedCall = await endVideoCall(activeCall.id);
        setActiveCall(null);
        endCall();

        const channel = supabase.channel(`video_call_${chatId}`);
        channel.send({
          type: "broadcast",
          event: "video_call_end",
          payload: {
            type: "ENDED",
            id: activeCall.id,
          },
        });
      } catch (error) {
        console.error("Error ending video call:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center space-y-4">
            {activeCall ? (
        <button
          onClick={handleEndCall}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          End Call
        </button>
      ) : (
        <button
          onClick={handleStartCall}
          disabled={isCallStarted}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Start Call
        </button>
      )}
      {activeCall && (
        <pre className="bg-gray-100 p-4 rounded-md text-sm">
          {JSON.stringify(activeCall, null, 2)}
        </pre>
      )}
      {isCalling && (
        <div className="bg-emerald-600 text-slate-100 p-4 rounded">
          <p>{isCalling.senderId} is calling</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={handleJoin}
          >
            Answer Call
          </button>
        </div>
      )}
      <div className="flex relative bg-slate-500  h-screen w-screen space-x-4">
        <div className="w-1/4 rounded-lg absolute bottom-[2rem]  left-[2rem]">
          {/* <h2 className="text-lg font-semibold mb-2">Local Stream</h2> */}
          {localStream && (
            <video
              ref={(video) => {
                if (video) video.srcObject = localStream;
              }}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg h-auto border "
            />
          )}
        </div>
        <div className="w-full h-full">
          <h2 className="text-lg font-semibold mb-2">Remote Stream</h2>
          {remoteStream && (
            <video
              ref={(video) => {
                if (video) video.srcObject = remoteStream;
              }}
              autoPlay
              playsInline
              className="w-full h-full border rounded"
            />
          )}
        </div>
      </div>

    </div>
  );
});
