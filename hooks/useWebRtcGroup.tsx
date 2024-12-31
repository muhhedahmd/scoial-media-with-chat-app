import { useState, useEffect, useCallback, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
// import Peer from 'simple-peer';
import supabase from "@/lib/Supabase";
import { v4 as uuidv4 } from "uuid";
import { SignalingType, VideoChatParticipant } from "@prisma/client";

interface PeerState {
  id: number;
  stream: MediaStream | null;
  connection: RTCPeerConnection | null;
}

enum SignalingState {
  Stable,
  HaveLocalOffer,
  HaveRemoteOffer,
  Closed,
}

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
  ],
};

export function useGroupWebRTC(roomId: number, userId: number) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerState[]>([]);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const peerConnectionsRef = useRef<{ [key: number]: RTCPeerConnection }>({});
  const signalingStateRef = useRef<{ [key: number]: SignalingState }>({});

  const channel = supabase.channel(`room:${roomId}`);
  channelRef.current = channel;


  useEffect(()=>{
    setupLocalStream()
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setupLocalStream = useCallback(async () => {
    console.log('[setupLocalStream] Setting up local stream');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
      setLocalStream(stream);
      console.log("Local stream set up successfully");
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  const createPeerConnection = useCallback(
    async (peerId: number, initiator: boolean) => {
      console.log(`[createPeerConnection] Creating peer connection for peer ${peerId}, initiator: ${initiator}`);
      if (!localStream) await setupLocalStream();
      console.log(`Creating peer connection for peer ${peerId}, initiator: ${initiator}`);
    
      const pc = new RTCPeerConnection(configuration);

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log(`ICE candidate for peer ${peerId}:`, event.candidate);
          await supabase.from("Signaling").insert({
            id: uuidv4(),
            roomId,
            senderId: userId,
            receiverParticipantId: peerId,
            type: "ICE_CANDIDATE",
            data: JSON.stringify(event.candidate),
          });

          channelRef.current?.send({
            type: 'broadcast',
            event: 'signal',
            payload: {
              type: "ICE_CANDIDATE",
              data: JSON.stringify(event.candidate),
              videoChatparticpentId: userId,
            },
          });
        }
      };

      pc.ontrack = (event) => {
        console.log(`Received track from peer ${peerId}:`, event.streams[0]);
        setPeers((currentPeers) => {
          const peerIndex = currentPeers.findIndex((p) => p.id === peerId);
          if (peerIndex !== -1) {
            const updatedPeers = [...currentPeers];
            updatedPeers[peerIndex].stream = event.streams[0];
            return updatedPeers;
          }
          return [...currentPeers, { id: peerId, stream: event.streams[0], connection: pc }];
        });
      };

      if(localStream){

        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream!);
          
        });
      }

      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await supabase.from("Signaling").insert({
          id: uuidv4(),
          roomId,
          senderId: userId,
          receiverParticipantId: peerId,
          type: "OFFER",
          data: JSON.stringify(offer),
        });

        channelRef.current?.send({
          type: 'broadcast',
          event: 'signal',
          payload: {
            type: "OFFER",
            data: JSON.stringify(offer),
            videoChatparticpentId: userId,
          },
        });
      }

      peerConnectionsRef.current[peerId] = pc;
      signalingStateRef.current[peerId] = SignalingState.Stable;

      return pc;
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    [roomId, userId]
  );

  const handlePeerDisconnection = useCallback((peerId: number) => {
    console.log(`[handlePeerDisconnection] Disconnecting peer ${peerId}`);
    delete peerConnectionsRef.current[peerId];
    delete signalingStateRef.current[peerId];
    setPeers((currentPeers) => currentPeers.filter((p) => p.id !== peerId));
  }, []);

  const handlePeerError = useCallback(
    (peerId: number) => {
      console.log(`[handlePeerError] Handling error for peer ${peerId}`);
      console.log(`Attempting to reconnect with peer ${peerId}`);
      const peer = peerConnectionsRef.current[peerId];
      if (peer) {
        peer.close();
        delete peerConnectionsRef.current[peerId];
        delete signalingStateRef.current[peerId];

        // Attempt to recreate the peer connection
        setTimeout(() => {
          createPeerConnection(peerId, true);
        }, 1000);
      }
    },
    [createPeerConnection]
  );


  const startCall = useCallback(
    async (participants: VideoChatParticipant[]) => {
      console.log('[startCall] Starting call with participants:', participants);
      console.log("Starting call");
      if (!localStream) {
        await setupLocalStream();
      }

      for (const participant of participants) {
        if (participant.userId !== userId && participant.userId) {
       const peer  =  await createPeerConnection(participant.userId, true);
       console.log({
        peer
       })
        }
      }
      setIsCallStarted(true);
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, createPeerConnection]
  );

  const joinCall = useCallback(

    async (participants: VideoChatParticipant[]) => {
      console.log('[joinCall] Joining call with participants:', participants);
      console.log("Joining call");
      await setupLocalStream();
      if(!peerConnectionsRef.current[userId] || (!peers.find((peer)=>peer.id === userId) )){
        await createPeerConnection(
          userId,
          true
        )
        

      }
      const participantsToConnect = participants.filter(
        (peer) => peer.userId !== userId
      );

      for (const peer of participantsToConnect) {
        if (peer.userId) {
       const Createdpeer =    await createPeerConnection(peer.userId, false);
       console.log({
        Createdpeer
       })
        }
      }

      setIsCallStarted(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ userId, createPeerConnection]
  );

  const leaveCall = useCallback(async () => {
    console.log('[leaveCall] Leaving call');
    console.log("Leaving call");
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};
    signalingStateRef.current = {};
    setPeers([]);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setIsCallStarted(false);

    await supabase.from("Signaling").insert({
      id: uuidv4(),
      roomId,
      senderId: userId,
      receiverId: null,
      type: "USER_LEFT",
      data: JSON.stringify({ userId }),
    });

    // Broadcast the user left message
    channelRef.current?.send({
      type: 'broadcast',
      event: 'signal',
      payload: {
        type: "USER_LEFT",
        data: JSON.stringify({ userId }),
        videoChatparticpentId: userId,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId]);

  useEffect(() => {
    console.log(`[useEffect] Setting up channel for room:${roomId}`);
    const channel = supabase.channel(`room:${roomId}`);
    channelRef.current = channel;

    channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
      const { type, data, videoChatparticpentId } = payload;
      console.log(`[Channel] Received signal: ${type} from peer ${videoChatparticpentId}`);

      if (videoChatparticpentId === userId) return; // Ignore our own messages

      let pc = peerConnectionsRef.current[videoChatparticpentId];
      if (!pc) {
        if (type === "OFFER") {
          console.log(`Creating new peer connection for incoming offer from ${videoChatparticpentId}`);
          pc = await createPeerConnection(videoChatparticpentId, false);
        } else {
          console.warn(`Received ${type} for unknown peer ${videoChatparticpentId}`);
          return;
        }
      }

      try {
        const signalData = JSON.parse(data);
        switch (type) {
          case "OFFER":
            await pc.setRemoteDescription(new RTCSessionDescription(signalData));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await supabase.from("Signaling").insert({
              id: uuidv4(),
              roomId,
              senderId: userId,
              receiverParticipantId: videoChatparticpentId,
              type: "ANSWER",
              data: JSON.stringify(answer),
            });
            channelRef.current?.send({
              type: 'broadcast',
              event: 'signal',
              payload: {
                type: "ANSWER",
                data: JSON.stringify(answer),
                videoChatparticpentId: userId,
              },
            });
            break;
          case "ANSWER":
            await pc.setRemoteDescription(new RTCSessionDescription(signalData));
            break;
          case "ICE_CANDIDATE":
            await pc.addIceCandidate(new RTCIceCandidate(signalData));
            break;
          case "USER_LEFT":
            const leftUserId = JSON.parse(data).userId;
            handlePeerDisconnection(leftUserId);
            break;
          case "ACTIVE_SPEAKER":
            setActiveSpeaker(JSON.parse(data).userId);
            break;
        }
      } catch (error) {
        console.error("Error processing signal:", error);
      }
    });

    channel.subscribe((status) => {
      console.log(`[Channel] Subscription status for room:${roomId}:`, status);
      if (status === "SUBSCRIBED") {
        console.log(`[Channel] Subscribed to room:${roomId}`);
      }
    });

    return () => {
      console.log(`[useEffect Cleanup] Unsubscribing from room:${roomId}`);
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId, userId, createPeerConnection, handlePeerDisconnection]);

  useEffect(() => {
    console.log('[State] localStream changed:', localStream);
  }, [localStream]);

  useEffect(() => {
    console.log('[State] peers changed:', peers);
  }, [peers]);

  useEffect(() => {
    console.log('[State] isCallStarted changed:', isCallStarted);
  }, [isCallStarted]);

  useEffect(() => {
    console.log('[State] activeSpeaker changed:', activeSpeaker);
  }, [activeSpeaker]);

  return {
    localStream,
    peers,
    startCall,
    joinCall,
    leaveCall,
    isCallStarted,
    activeSpeaker,
  };
}

