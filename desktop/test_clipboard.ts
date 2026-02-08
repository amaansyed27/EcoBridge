import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected to server");
    
    // Simulate a clipboard sync event from mobile to desktop
    const testText = "Hello from simulated mobile clipboard! " + new Date().toLocaleTimeString();
    console.log(`Sending clipboard-sync event: "${testText}"`);
    
    socket.emit("clipboard-sync", {
        text: testText
    });

    // Listen for clipboard-sync events from desktop (if desktop clipboard changes)
    socket.on("clipboard-sync", (data: { text: string }) => {
        console.log("Received clipboard-sync from server:", data.text);
    });

    console.log("Waiting for 10 seconds to receive updates if you copy something on your PC...");
    
    // Close after some time
    setTimeout(() => {
        console.log("Test finished.");
        socket.disconnect();
        process.exit(0);
    }, 10000);
});

socket.on("connect_error", (err: Error) => {
    console.error("Connection error:", err);
});
