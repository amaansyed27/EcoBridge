const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 3000;

console.log("🚀 Starting EcoBridge Socket Server...");

io.on('connection', (socket) => {
    console.log('🔌 Device Connected:', socket.id);

    // Identify device type
    socket.on('register', (type) => {
        console.log(`📱 Registered as: ${type}`);
    });

    // Receive video stream
    socket.on('video-frame', (data) => {
        // Broadcast to virtual driver (future implementation)
        socket.broadcast.emit('stream-data', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`   - WiFi Mode: http://YOUR_PC_IP:${PORT}`);
    console.log(`   - USB Mode:  adb reverse tcp:${PORT} tcp:${PORT}`);
});