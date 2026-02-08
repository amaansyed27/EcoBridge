import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected to server");
    
    // Simulate a mouse move event
    console.log("Sending mouse-move event...");
    socket.emit("remote-input", {
        type: "mouse-move",
        params: { dx: 400, dy: 50 }
    });

    // Simulate keyboard event
    setTimeout(() => {
        console.log("Sending keyboard event...");
        socket.emit("remote-input", {
            type: "keyboard",
            params: { text: "Hello" }
        });
    }, 2000);

    setTimeout(() => {
        console.log("Sending mouse-click event...");
        socket.emit("remote-input", {
            type: "mouse-click",
            params: { button: "left" }
        });
    }, 1000);

    // Close after some time
    setTimeout(() => {
        socket.disconnect();
        process.exit(0);
    }, 5000);
});

socket.on("connect_error", (err: Error) => {
    console.error("Connection error:", err);
});
