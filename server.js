const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(__dirname));

// Track connected users
let connectedUsers = 0;
const boxStates = {
    row1: [false, false, false, false, false], // Initially all grey
    row2: [false, false, false, false, false]  // Initially all grey
};

// Set initial active box (index 2 as an example)
boxStates.row1[2] = true;
boxStates.row2[2] = true;

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Assign user role (user1 or user2)
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
            // Reset all boxes in row1
            boxStates.row1 = boxStates.row1.map(() => false);
            // Set clicked box to active
            boxStates.row1[index] = true;
        } else if (user === 'user2') {
            // Reset all boxes in row2
            boxStates.row2 = boxStates.row2.map(() => false);
            // Set clicked box to active
            boxStates.row2[index] = true;
        }
        
        // Broadcast updated states to all clients
        io.emit('update boxes', boxStates);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (user && (user === 'user1' || user === 'user2')) {
            connectedUsers--;
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});