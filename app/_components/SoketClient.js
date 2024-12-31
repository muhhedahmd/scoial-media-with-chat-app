// components/SocketClient.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

let socket;

const SocketClient = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Connect to the Socket.IO server with the token
      socket = io({
        query: { token: session.accessToken },
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      socket.on('message', (msg) => {
        console.log('Received message:', msg);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [session]);

  return null;
};

export default SocketClient;
