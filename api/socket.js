const { Server } = require('socket.io');
const http = require('http');

// Create HTTP server
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server Running');
});

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for now (tighten this later)
    methods: ["GET", "POST"]
  }
});

// Track connections
let connectedUsers = 0;
const boxStates = {
  row1: [false, false, true, false, false], // Middle box active
  row2: [false, false, true, false, false]  // Middle box active
};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  
  // Assign user role
  let user;
  if (connectedUsers < 2) {
    connectedUsers++;
    user = `user${connectedUsers}`;
    socket.emit('assign user', user);
  } else {
    socket.emit('assign user', 'spectator');
  }
  
  // Send initial state
  socket.emit('update boxes', boxStates);
  
  // Handle box clicks
  socket.on('box click', ({ user, index }) => {
    if (user === 'user1') {
      boxStates.row1 = boxStates.row1.map(() => false);
      boxStates.row1[index] = true;
    } else if (user === 'user2') {
      boxStates.row2 = boxStates.row2.map(() => false);
      boxStates.row2[index] = true;
    }
    io.emit('update boxes', boxStates);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    if (user && user.match(/user[12]/)) connectedUsers--;
  });
});

// Vercel requires this export
module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO endpoint');
};

// Start server (for local testing)
if (process.env.VERCEL !== '1') {
  httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}