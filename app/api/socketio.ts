// pages/api/socketio.ts
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';

const GET = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    console.log('Initializing Socket.IO server...');
    const io = new SocketIOServer((res.socket as any).server);
    (res.socket as any).server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('create-something', (value, callback) => {
        console.log('Received create-something event:', value);
        // Simulate some processing
        setTimeout(() => {
          socket.emit('foo', `Processed: ${value}`);
          callback();
        }, 1000);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  } else {
    console.log('Socket.IO server already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// export default SocketHandler;