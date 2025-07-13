const { Server } = require('socket.io');

const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://socket-mic-check.vercel.app",
      "https://socket-mic-check-git-main-yourusername.vercel.app",
      "http://localhost:3000" // for local testing
    ],
    methods: ["GET", "POST"]
  },
  path: "/socket.io/" // Must match client
});
let httpServer;

// Track connected users
let connectedUsers = 0;
const boxStates = {
    row1: [false, false, false, false, false],
    row2: [false, false, false, false, false]
};

// Set initial active box
boxStates.row1[2] = true;
boxStates.row2[2] = true;

module.exports = (req, res) => {
  if (!httpServer) {
    httpServer = require('http').createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Socket.IO server');
    });
    
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    httpServer.listen(process.env.PORT || 3000);
    
    io.on('connection', (socket) => {
      console.log('New client connected');
      
      // Assign user role
      let user;
      if (connectedUsers < 2) {
        connectedUsers++;
        user = `user${connectedUsers}`;
        socket.emit('assign user', user);
      } else {
        socket.emit('assign user', 'spectator');
      }
      
      // Send initial box states
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
        console.log('Client disconnected');
        if (user && (user === 'user1' || user === 'user2')) {
          connectedUsers--;
        }
      });
    });
  }
  
  res.status(200).send('Socket.IO server');
};