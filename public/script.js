document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://socket-mic-check.vercel.app', {
  transports: ['websocket'], // Force WebSocket transport
  path: '/socket.io/' // Match your Vercel route
});
    let currentUser = null;
    
    // Get all boxes
    const boxesRow1 = document.querySelectorAll('#row1 .box');
    const boxesRow2 = document.querySelectorAll('#row2 .box');
    
    // Display user assignment
    const userDisplay = document.getElementById('user-display');
    
    // Handle server assigning user role
    socket.on('assign user', (user) => {
        currentUser = user;
        userDisplay.textContent = `You are: ${user === 'user1' ? 'User 1 (Top Row)' : 'User 2 (Bottom Row)'}`;
        
        // Enable/disable boxes based on user
        const myBoxes = user === 'user1' ? boxesRow1 : boxesRow2;
        const otherBoxes = user === 'user1' ? boxesRow2 : boxesRow1;
        
        myBoxes.forEach(box => {
            box.addEventListener('click', handleBoxClick);
        });
        
        otherBoxes.forEach(box => {
            box.style.cursor = 'not-allowed';
        });
    });
    
    // Handle box state updates from server
    socket.on('update boxes', (boxStates) => {
        updateBoxes(boxesRow1, boxStates.row1);
        updateBoxes(boxesRow2, boxStates.row2);
    });
    
    // Update box appearance based on state
    function updateBoxes(boxes, states) {
        boxes.forEach((box, index) => {
            if (states[index]) {
                box.classList.add('active');
            } else {
                box.classList.remove('active');
            }
        });
    }
    
    // Handle box clicks
    function handleBoxClick(e) {
        const boxIndex = parseInt(e.target.getAttribute('data-index'));
        socket.emit('box click', { 
            user: currentUser, 
            index: boxIndex 
        });
    }
});