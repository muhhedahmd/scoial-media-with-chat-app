import { useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';

const useSocket = ({serverUrl}:{
    serverUrl: string
}) => {
  const [socket, setSocket] = useState<Socket<any, any>>();

  useEffect(() => {
    const socketIo = io(serverUrl, {
      transports: ['websocket'], // Optional: specify transports
    });

    setSocket(socketIo);

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket;
