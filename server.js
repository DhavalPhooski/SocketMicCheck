const { Server } = require('socket.io');
const http = require('http');

// Create HTTP server
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server Ready');
});

// Initialize Socket.IO with proper CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://socket-mic-check.vercel.app",
      "https://socket-mic-check-*.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io/",
  transports: ["websocket", "polling"],
  allowEIO3: true
});

// Your existing connection and event handlers here
let connectedUsers = 0;
const boxStates = {
  row1: [false, false, true, false, false],
  row2: [false, false, true, false, false]
};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  // Your existing event handlers...
});

// Vercel-specific export
module.exports = httpServer;