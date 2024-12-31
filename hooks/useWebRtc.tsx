import { useState, useEffect, useRef, useCallback } from "react";
import supabase from "@/lib/Supabase";
import { v4 as uuidv4 } from "uuid";
import { SignalingType } from "@prisma/client";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

export function useWebRTC(
  roomId: number | null,
  senderId: number,
  receiverId: number | null,
  startedJoin: boolean,
  LocalStreamDialog: boolean,
  isDialogOpen :boolean
) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoSettings  , setVideoSettings] = useState({
    audio : true ,
    video:true
  })
  const [isCallStarted, setIsCallStarted] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const createPeerConnection = useCallback(async () => {

    if(!isDialogOpen) return
    console.log("fired" ,"createPeerConnection")
    if (peerConnection.current) {
      return peerConnection.current;
    }

    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;
    if (!localStream) {
      const local = await navigator.mediaDevices.getUserMedia(videoSettings);
      local.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, local);
      });
      setLocalStream(local);
    }

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream?.addTrack(track);
      });

      setRemoteStream(event.streams[0]);
    };
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const iceCandidateData = {
          id: uuidv4(),
          roomId: roomId,
          type: "ICE_CANDIDATE" as SignalingType,
          data: JSON.stringify(event.candidate),
          senderId: senderId,
          receiverId: receiverId,
        };

        await supabase.from("Signaling").insert(iceCandidateData);

        // Send through real-time channel
        channelRef.current?.send({
          type: "broadcast",
          event: "signal",
          payload: {
            type: "ICE_CANDIDATE" as SignalingType,
            data: iceCandidateData,
          },
        });
      }
    };

    return pc;
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, senderId, receiverId ,isDialogOpen]);


  let createOffer = useCallback(async () => {

    if(!isDialogOpen) return
    console.log("fired" ,"createOffer")

    if (
      !peerConnection.current ||
      peerConnection?.current.connectionState === "closed"
    )
      return;
    await createPeerConnection();

    let offer = await peerConnection.current!.createOffer();
    await peerConnection.current!.setLocalDescription(offer);

    const offerData = {
      id: uuidv4(),
      roomId: roomId,
      type: "ANSWER" as SignalingType,
      data: JSON.stringify(offer),
      senderId: senderId,
      receiverId: receiverId,
    };
    await supabase.from("Signaling").insert(offerData);

    channelRef.current?.send({
      type: "broadcast",
      event: "signal",
      payload: { type: "OFFER", data: offerData },
    });

    setIsCallStarted(true);
  }, [createPeerConnection, receiverId, roomId, senderId ,isDialogOpen]);

  let createAnswer = useCallback( async (offer: any) => {
      if(!isDialogOpen) return
      console.log("fired" ,"createAnswer")

      if (!peerConnection.current) return;
      await createPeerConnection();

      await peerConnection.current!.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(offer))
      );
      const answer = await peerConnection.current.createAnswer();
      console.log({
        offer,
        answer,
      });

      await peerConnection.current!.setLocalDescription(answer);
      console.log({
        answer,
        remoteDescription: peerConnection.current!.remoteDescription,
      });

      const answerData = {
        id: uuidv4(),
        roomId: roomId,
        type: "ANSWER" as SignalingType,
        data: JSON.stringify(answer),
        senderId: senderId,
        receiverId: receiverId,
      };

      await supabase.from("Signaling").insert(answerData);
      channelRef.current?.send({
        type: "broadcast",
        event: "signal",
        payload: { type: "ANSWER", data: answerData },
      });
    },
    [createPeerConnection, receiverId, roomId, senderId ,isDialogOpen]
  
  );

  const setupLocalStream = useCallback(async () => {  
    if (!isDialogOpen) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(videoSettings);
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
    return ()=>{
      if(localStream)
      {
        navigator.mediaDevices.removeEventListener("devicechange" , async()=> await navigator.mediaDevices.getUserMedia(videoSettings))
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        setLocalStream(null);
      }

    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSettings  ,isDialogOpen]);

  useEffect(() => {

    if (!isDialogOpen) return;

    setupLocalStream();
  }, [isDialogOpen , setupLocalStream ]);

  useEffect(() => {

    setupLocalStream();

    channelRef.current = supabase.channel(`room:${roomId}`);

    channelRef.current.on(
      "broadcast",

      { event: "signal" },
      async ({ payload }) => {
        console.log("Received signal:", payload);
        if (!payload || !payload.type || !payload.data) {
          console.error("Invalid payload received:", payload);
          return;
        }

        const { type, data } = payload;
        if (!peerConnection.current) {
          await createPeerConnection();
        }

        try {
          if (type === "OFFER") {
            createAnswer(data.data);
          } else if (type === "ICE_CANDIDATE") {
            await peerConnection.current!.addIceCandidate(
              new RTCIceCandidate(JSON.parse(data.data))
            );
          } else if (type === "ANSWER") {
            console.log("ANSWER");
            await peerConnection.current!.setRemoteDescription(
              new RTCSessionDescription(JSON.parse(data.data))
            );
          }
        } catch (error) {
          console.error("Error processing signal:", error);
        }
      }
    );

    channelRef.current.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to signaling channel");
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (peerConnection.current) {
        
        peerConnection.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roomId,
    senderId,
    receiverId,
    createPeerConnection,
    createAnswer,
    channelRef,
  ]);

  const startCall = useCallback(async () => {


    if (!isDialogOpen) return
    console.log("fired" ,"startCall")

    if (!localStream) {
      await setupLocalStream();
    }
    if (!startedJoin) return;

    if (!peerConnection.current) {
      await createPeerConnection();
    }
    try {
      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      const offerData = {
        id: uuidv4(),
        roomId: roomId,
        type: "OFFER" as SignalingType,
        data: JSON.stringify(offer),
        senderId: senderId,
        receiverId: receiverId,
      };

      await supabase.from("Signaling").insert(offerData);

      channelRef.current?.send({
        type: "broadcast",
        event: "signal",
        payload: { type: "OFFER", data: offerData },
      });

      setIsCallStarted(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedJoin ,isDialogOpen]);

  const joinCall = useCallback(async () => {
    
    if (!isDialogOpen) return;
    console.log("fired" ,"joinCall")

    if (!peerConnection.current) {
      await createPeerConnection();
    }
    if (!localStream) {
      await setupLocalStream();
    }

    createOffer();
    setIsCallStarted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOffer, createPeerConnection, setupLocalStream, isDialogOpen]);

  const endCall = useCallback(async () => {
    if (!startedJoin) return;
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setIsCallStarted(false);
    await supabase.from("Signaling").delete().eq("roomId", roomId);
  }, [roomId, startedJoin]);

  return {
    localStream,
    remoteStream,
    startCall,
    joinCall,
    endCall,
    isCallStarted,
    setVideoSettings 
    ,videoSettings
  };
}
