document.addEventListener('DOMContentLoaded', () => {
  // Status indicator
  const statusEl = document.createElement('div');
  statusEl.style.cssText = 'position:fixed;top:0;left:0;background:#333;color:white;padding:10px;z-index:1000';
  document.body.prepend(statusEl);

  // Initialize Socket.IO
const socket = io('https://socket-mic-check.vercel.app', {
  path: '/socket.io/',
  transports: ['websocket', 'polling'], // Fallback to polling if WS fails
  withCredentials: true,
  reconnectionAttempts: 5,
  autoConnect: true
});

  // Connection status
  socket.on('connect', () => {
    statusEl.textContent = 'Connected ✅';
    statusEl.style.background = 'green';
  });

  socket.on('disconnect', () => {
    statusEl.textContent = 'Disconnected ❌';
    statusEl.style.background = 'red';
  });

  socket.on('connect_error', (err) => {
    statusEl.textContent = `Error: ${err.message}`;
    statusEl.style.background = 'darkred';
  });

  // Rest of your existing socket logic...
});

// Debugging connection status
const statusEl = document.createElement('div');
statusEl.style.cssText = 'position:fixed;top:0;left:0;background:#000;color:#fff;padding:10px;z-index:9999';
document.body.appendChild(statusEl);

socket.on('connect', () => {
  statusEl.textContent = `Connected (ID: ${socket.id})`;
  statusEl.style.background = 'green';
});

socket.on('disconnect', () => {
  statusEl.textContent = 'Disconnected';
  statusEl.style.background = 'red';
});

socket.on('connect_error', (err) => {
  statusEl.textContent = `Error: ${err.message}`;
  statusEl.style.background = 'darkred';
  console.error('Connection error:', err);
});