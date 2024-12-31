import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import supabase from '@/lib/Supabase';
import Peer from "simple-peer"

// Replace with your Supabase project details


interface Peer {
  id: number;
  stream: MediaStream | null;
  peerInstance: Peer.Instance;
}

interface UserVideoAudio {
  [userId: number]: { video: boolean; audio: boolean };
}
enum SignalingState {
  Stable,
  HaveLocalOffer,
  HaveRemoteOffer,
  Closed,
}

export function useGroupRTC(roomId: number, currentUser: { id: number; name: string }) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [userVideoAudio, setUserVideoAudio] = useState<UserVideoAudio>({
    [currentUser.id]: { video: true, audio: true },
  });
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [screenShare, setScreenShare] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const peerConnectionsRef = useRef<{ [key: number]: Peer.Instance }>({});
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const signalingStateRef = useRef<{ [key: number]: SignalingState }>({});

  const getVideoDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevs = devices.filter((device) => device.kind === 'videoinput');
    setVideoDevices(videoDevs);
  }, []);

  const createPeer = useCallback((targetUserId: number, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', async (signal) => {
      await supabase.from('Signaling').insert({
        roomId,
        senderId: currentUser.id,
        receiverId: targetUserId,
        type: 'OFFER',
        data: JSON.stringify(signal),
      });
    });

    peer.on('stream', (remoteStream) => {
      setPeers((currentPeers) => {
        const peerIndex = currentPeers.findIndex((p) => p.id === targetUserId);
        if (peerIndex !== -1) {
          const updatedPeers = [...currentPeers];
          updatedPeers[peerIndex].stream = remoteStream;
          return updatedPeers;
        }
        return [...currentPeers, { id: targetUserId, stream: remoteStream, peerInstance: peer }];
      });
    });
    
    signalingStateRef.current[targetUserId] = SignalingState.Stable;
    peerConnectionsRef.current[targetUserId] = peer;
    return peer;
  }, [roomId, currentUser.id]);

  const addPeer = useCallback((incomingSignal: Peer.SignalData, callerId: number, stream: MediaStream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', async (signal) => {
      await supabase.from('Signaling').insert({
        roomId,
        senderId: currentUser.id,
        receiverId: callerId,
        type: 'ANSWER',
        data: JSON.stringify(signal),
      });
    });

    peer.on('stream', (remoteStream) => {
      setPeers((currentPeers) => {
        const peerIndex = currentPeers.findIndex((p) => p.id === callerId);
        if (peerIndex !== -1) {
          const updatedPeers = [...currentPeers];
          updatedPeers[peerIndex].stream = remoteStream;
          return updatedPeers;
        }
        return [...currentPeers, { id: callerId, stream: remoteStream, peerInstance: peer }];
      });
    });

    peer.signal(incomingSignal);
    peerConnectionsRef.current[callerId] = peer;
    return peer;
  }, [roomId, currentUser.id]);

  const setupLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: true 
      });
      setLocalStream(stream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }, []);

  const startCall = useCallback(async () => {
    await setupLocalStream();
    setIsCallStarted(true);

    // Notify other participants that you've joined
    await supabase.from('Signaling').insert({
      roomId,
      senderId: currentUser.id,
      receiverId: null,
      type: 'USER_JOINED',
      data: JSON.stringify({ userId: currentUser.id }),
    });
  }, [setupLocalStream, roomId, currentUser.id]);

  const leaveCall = useCallback(async () => {
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.destroy());
    peerConnectionsRef.current = {};
    setPeers([]);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setIsCallStarted(false);

    await supabase.from('Signaling').insert({
      roomId,
      senderId: currentUser.id,
      receiverId: null,
      type: 'USER_LEFT',
      data: JSON.stringify({ userId: currentUser.id }),
    });
  }, [localStream, roomId, currentUser.id]);

  const toggleCameraAudio = useCallback((target: 'video' | 'audio') => {
    setUserVideoAudio((prev) => {
      const videoSwitch = target === 'video' ? !prev[currentUser.id].video : prev[currentUser.id].video;
      const audioSwitch = target === 'audio' ? !prev[currentUser.id].audio : prev[currentUser.id].audio;

      if (localStream) {
        if (target === 'video') {
          localStream.getVideoTracks()[0].enabled = videoSwitch;
        } else {
          localStream.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      // Broadcast the change to other participants
      supabase.from('Signaling').insert({
        roomId,
        senderId: currentUser.id,
        receiverId: null,
        type: 'TOGGLE_MEDIA',
        data: JSON.stringify({ userId: currentUser.id, [target]: target === 'video' ? videoSwitch : audioSwitch }),
      });

      return {
        ...prev,
        [currentUser.id]: { video: videoSwitch, audio: audioSwitch },
      };
    });
  }, [currentUser.id, localStream, roomId]);

  const clickScreenSharing = useCallback(async () => {
    if (!screenShare) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
        const screenTrack = stream.getTracks()[0];

        Object.values(peerConnectionsRef.current).forEach((peer) => {
          peer.replaceTrack(
            localStream!.getVideoTracks()[0],
            screenTrack,
            localStream!
          );
        });

        screenTrack.onended = () => {
          Object.values(peerConnectionsRef.current).forEach((peer) => {
            peer.replaceTrack(
              screenTrack,
              localStream!.getVideoTracks()[0],
              localStream!
            );
          });
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = localStream;
          }
          setScreenShare(false);
        };

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        screenTrackRef.current = screenTrack;
        setScreenShare(true);
      } catch (error) {
        console.error('Error accessing screen sharing:', error);
      }
    } else {
      screenTrackRef.current?.stop();
    }
  }, [screenShare, localStream]);

  useEffect(() => {
    getVideoDevices();

    const channel = supabase.channel(`room:${roomId}`);
    channelRef.current = channel;

    channel.on('broadcast', { event: 'signal' }, async ({ payload }) => {
      const { type, data, senderId } = payload;

      switch (type) {
        case 'USER_JOINED':
          if (senderId !== currentUser.id && localStream) {
            createPeer(senderId, localStream);
          }
          break;
        case 'OFFER':
          if (senderId !== currentUser.id) {
            const signal = JSON.parse(data);
            if (localStream) {
              addPeer(signal, senderId, localStream);
            }
          }
          break;
        case 'ANSWER':
          if (peerConnectionsRef.current[senderId]) {
            const signal = JSON.parse(data);
            peerConnectionsRef.current[senderId].signal(signal);
          }
          break;
        case 'ICE_CANDIDATE':
          if (peerConnectionsRef.current[senderId]) {
            const candidate = JSON.parse(data);
            
            peerConnectionsRef.current[senderId].signal(candidate|| "");
          }
          break;
        case 'USER_LEFT':
          const leftUserId = JSON.parse(data).userId;
          if (peerConnectionsRef.current[leftUserId]) {
            peerConnectionsRef.current[leftUserId].destroy();
            delete peerConnectionsRef.current[leftUserId];
          }
          setPeers((currentPeers) => currentPeers.filter((p) => p.id !== leftUserId));
          break;
        case 'TOGGLE_MEDIA':
          const { userId, video, audio } = JSON.parse(data);
          setUserVideoAudio((prev) => ({
            ...prev,
            [userId]: { video: video !== undefined ? video : prev[userId]?.video, audio: audio !== undefined ? audio : prev[userId]?.audio },
          }));
          break;
        case 'ACTIVE_SPEAKER':
          setActiveSpeaker(JSON.parse(data).userId);
          break;
      }
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to room:${roomId}`);
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      leaveCall();
    };
  }, [roomId, currentUser.id, localStream, createPeer, addPeer, getVideoDevices, leaveCall]);

  return {
    localStream,
    peers,
    userVideoAudio,
    videoDevices,
    screenShare,
    isCallStarted,
    activeSpeaker,
    userVideoRef,
    startCall,
    leaveCall,
    toggleCameraAudio,
    clickScreenSharing,
  };
}

