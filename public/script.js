// Wait for DOM and Socket.IO to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize socket connection
  const socket = io('https://socket-mic-check.vercel.app', {
    path: '/socket.io/',
    transports: ['websocket', 'polling']
  });

  // Debug connection status
  const statusEl = document.createElement('div');
  statusEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    background: #333;
    color: white;
    padding: 10px;
    z-index: 9999;
    font-family: Arial;
  `;
  document.body.prepend(statusEl);

  // Connection events
  socket.on('connect', () => {
    statusEl.textContent = `✅ Connected (ID: ${socket.id})`;
    statusEl.style.background = 'green';
  });

  socket.on('disconnect', () => {
    statusEl.textContent = '❌ Disconnected';
    statusEl.style.background = 'red';
  });

  socket.on('connect_error', (err) => {
    statusEl.textContent = `⚠️ Error: ${err.message}`;
    statusEl.style.background = 'darkorange';
    console.error('Connection error:', err);
  });

  // Your existing box control logic here...
  // Make sure all socket-related code is inside this DOMContentLoaded handler
});