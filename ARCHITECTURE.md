# EcoBridge System Architecture

## Overview
EcoBridge transforms a mobile device into a high-performance webcam for desktop applications.

## Technology Stack
-   **Mobile (Sender):** Flutter (Dart)
    -   Uses the `camera` package for raw frame capture.
    -   Uses `socket_io_client` for low-latency transmission.
-   **Desktop (Receiver):** Electron + Next.js
    -   Runs a local Socket.io server (`socket_server.js`).
    -   Receives frames and manages the virtual driver pipeline.

## Communication Protocol
1.  **Transport:** WebSockets (Socket.io).
2.  **Payload:** Binary video frames emitted as `video-frame` events.

## Connectivity Modes
-   **WiFi Mode:** Devices connect over local LAN.
-   **USB Mode:** Uses ADB Reverse Tunneling (`adb reverse tcp:3000 tcp:3000`) for zero latency.