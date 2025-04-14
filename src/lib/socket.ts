import io from "socket.io-client";

const getSocket = () => {
  const socket = io("http://localhost:3000", {
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  socket.on('port', (newPort: number) => {
    if (newPort !== 3000) {
      console.log(`Reconnecting to port ${newPort}`);
      const newSocket = io(`http://localhost:${newPort}`);
      socket.close();
      return newSocket;
    }
  });

  return socket;
};

const socket = getSocket();

export default socket;
