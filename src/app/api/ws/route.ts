import { WebSocketServer } from 'ws';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'http';
import { Socket } from 'net';

// Extend the Socket type to include the 'server' property
interface ExtendedSocket extends Socket {
  server: Server & { wss?: WebSocketServer };
}

// Next.js API route config
export const config = {
  api: {
    bodyParser: false,
  },
};

const wssHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket && !(res.socket as ExtendedSocket).server.wss) {
    const server = (res.socket as ExtendedSocket).server;
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        // Broadcast message to all clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });
    });

    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    (res.socket as ExtendedSocket).server.wss = wss;
  }

  res.end();
};

// Removed duplicate declaration of wssHandler

export default wssHandler;