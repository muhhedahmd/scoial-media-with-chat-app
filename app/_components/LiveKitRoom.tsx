'use client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
  VideoTrack,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';

export default function VideoConference({
  roomId,
  user,
}: { 
  roomId: number;
  user: string;
}) {
  const [token, setToken] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/live-kit-token?room=${roomId}&username=${"user"+Math.random()*100}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [roomId, user]);

  if (token === '') {
    return <div>Getting token...</div>;
  }

  return (
    <div className="w-full h-[600px] max-h-[80vh]"> {/* Adjust these values as needed */}
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ width: '100%', height: '100%' }}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const { localParticipant } = useLocalParticipant();
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        await localParticipant.setCameraEnabled(true);
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error enabling camera:', error);
      }
    };
    enableCamera();
  }, [localParticipant]);



  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <GridLayout 
          tracks={tracks} 
          style={{ height: 'calc(100% - 60px)' }}
        >
          <ParticipantTile />
        </GridLayout>
      </div>
    
    </div>
  );
}

