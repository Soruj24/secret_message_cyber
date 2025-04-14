const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (msg) => {
      const messageData = {
        id: Date.now(),
        text: msg,
        sender: socket.id
      };
      io.emit("message", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  const PORT = process.env.PORT || 3000;
  const MAX_PORT_ATTEMPTS = 10;
  let currentPort = PORT;

  const startServer = (port) => {
    server.listen(port)
      .on('listening', () => {
        console.log(`Server running at http://localhost:${port}`);
        // Update the socket client configuration with the correct port
        io.on('connection', socket => {
          socket.emit('port', port);
        });
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE' && currentPort < PORT + MAX_PORT_ATTEMPTS) {
          console.log(`Port ${port} is busy, trying port ${port + 1}`);
          currentPort++;
          startServer(currentPort);
        } else {
          console.error('Error starting server:', err);
          process.exit(1);
        }
      });
  };

  startServer(currentPort);
});
