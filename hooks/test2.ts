import { useState, useEffect, useCallback, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import Peer from 'simple-peer';
import supabase from "@/lib/Supabase";
import { v4 as uuidv4 } from "uuid";
import { SignalingType, VideoChatParticipant } from "@prisma/client";

interface PeerState {
  id: number;
  stream: MediaStream | null;
  peer: Peer.Instance | null;
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
  const peerConnectionsRef = useRef<{ [key: number]: Peer.Instance }>({});
  const signalingStateRef = useRef<{ [key: number]: SignalingState }>({});
  const channel = supabase.channel(`room:${roomId}`);
  channelRef.current = channel;

  const createPeer = useCallback(
    async (peerId: number, initiator: boolean) => {
      if (!localStream) await setupLocalStream();
      console.log(`Creating peer connection for peer ${peerId}, initiator: ${initiator}`);
      
      const peer = new Peer({
        initiator,
        trickle : false ,
        stream: localStream!,
        config: configuration,
      });
      

      peer.on("signal", async (data) => {
        console.log(`Signaling data for peer ${peerId}:`, data);
        await supabase.from("Signaling").insert({
          id: uuidv4(),
          roomId,
          senderId: userId,
          receiverParticipantId: peerId,
          type: "data.type.toUpperCase() "as SignalingType,
          data: JSON.stringify(data),
        });

        // Broadcast the signal to the room
        channelRef.current?.send({
          type: 'broadcast',
          event: 'signal',
          payload: {
            type: data.type.toUpperCase(),
            data: JSON.stringify(data),
            videoChatparticpentId: userId,
          },
        });
      });

      peer.on("stream", (stream) => {
        console.log(`Received stream from peer ${peerId}:`, stream);
        setPeers((currentPeers) => {
          const peerIndex = currentPeers.findIndex((p) => p.id === peerId);
          if (peerIndex !== -1) {
            const updatedPeers = [...currentPeers];
            updatedPeers[peerIndex].stream = stream;
            return updatedPeers;
          }
          return [...currentPeers, { id: peerId, stream, peer }];
        });
      });

      peer.on("close", () => {
        console.log(`Connection closed with peer ${peerId}`);
        handlePeerDisconnection(peerId);
      });

      peer.on("error", (err) => {
        console.error(`Error with peer ${peerId}:`, err);
        handlePeerError(peerId);
      });

      peer.on("connect", () => {
        console.log(`Connected to peer ${peerId}`);
      });

      peerConnectionsRef.current[peerId] = peer;
      signalingStateRef.current[peerId] = SignalingState.Stable;

      console.log(peers)
      return peer;
    },
    [roomId, userId]
  );

  const handlePeerDisconnection = useCallback((peerId: number) => {
    delete peerConnectionsRef.current[peerId];
    delete signalingStateRef.current[peerId];
    setPeers((currentPeers) => currentPeers.filter((p) => p.id !== peerId));
  }, []);

  const handlePeerError = useCallback(
    (peerId: number) => {
      console.log(`Attempting to reconnect with peer ${peerId}`);
      const peer = peerConnectionsRef.current[peerId];
      if (peer) {
        peer.destroy();
        delete peerConnectionsRef.current[peerId];
        delete signalingStateRef.current[peerId];

        // Attempt to recreate the peer connection
        setTimeout(() => {
          createPeer(peerId, true);
        }, 1000);
      }
    },
    [createPeer]
  );

  const setupLocalStream = useCallback(async () => {
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

  const startCall = useCallback(
    async (participants: VideoChatParticipant[]) => {
      console.log("Starting call");
      if (!localStream) {
        await setupLocalStream();
      }

      for (const participant of participants) {
        if (participant.userId !== userId && participant.userId) {
          await createPeer(participant.userId, true);
        }
      }
      setIsCallStarted(true);
    },
    [userId, setupLocalStream, createPeer]
  );

  const joinCall = useCallback(
    async (participants: VideoChatParticipant[]) => {
      console.log("Joining call");
      await setupLocalStream();
      const participantsToConnect = participants.filter(
        (peer) => peer.userId !== userId
      );

      for (const peer of participantsToConnect) {
        if (peer.userId) {
          await createPeer(peer.userId, false);
        }
      }

      setIsCallStarted(true);
    },
    [setupLocalStream, userId, createPeer]
  );

  const leaveCall = useCallback(async () => {
    console.log("Leaving call");
    Object.values(peerConnectionsRef.current).forEach((peer) => peer.destroy());
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
  }, [roomId, userId]);

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`);
    channelRef.current = channel;

    channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
      const { type, data, videoChatparticpentId } = payload;
      console.log(`Received signal: ${type} from peer ${videoChatparticpentId}`);

      if (videoChatparticpentId === userId) return; // Ignore our own messages

      let peer = peerConnectionsRef.current[videoChatparticpentId];
      if (!peer) {
        if (type === "OFFER") {
          console.log(`Creating new peer for incoming offer from ${videoChatparticpentId}`);
          peer = await createPeer(videoChatparticpentId, false);
        } else {
          console.warn(`Received ${type} for unknown peer ${videoChatparticpentId}`);
          return;
        }
      }

      try {
        peer.signal(JSON.parse(data));
      } catch (error) {
        console.error("Error processing signal:", error);
      }

      if (type === "USER_LEFT") {
        const leftUserId = JSON.parse(data).userId;
        handlePeerDisconnection(leftUserId);
      } else if (type === "ACTIVE_SPEAKER") {
        setActiveSpeaker(JSON.parse(data).userId);
      }
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`Subscribed to room:${roomId}`);
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId, userId, createPeer, handlePeerDisconnection]);

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

