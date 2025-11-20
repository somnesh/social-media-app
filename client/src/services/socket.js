import { io } from "socket.io-client";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const socket = io(SERVER_URL);

let heartbeatInterval;

socket.on("connect", () => {
  console.log("Connected to the server with socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log(`Disconnected socket ID: ${socket.id}`);
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
});

// Start heartbeat when user registers
export function startHeartbeat(userId) {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  // Send heartbeat every 20 seconds (before 30s TTL expires)
  heartbeatInterval = setInterval(() => {
    socket.emit("heartbeat", { userId });
  }, 20000);
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
}

export default socket;
