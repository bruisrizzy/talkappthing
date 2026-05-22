const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (roomCode) => {
        // Leave all previous rooms except the default socket.id room
        const currentRooms = Array.from(socket.rooms);
        currentRooms.forEach((room) => {
            if (room !== socket.id) {
                socket.leave(room);
            }
        });

        // Join the new room
        socket.join(roomCode);
        console.log(`User joined room: ${roomCode}`);
    });

    socket.on('chat message', (data) => {
        io.to(data.room).emit('chat message', { user: data.user, text: data.text });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
