import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
console.log(SOCKET_URL);

// Initialize the socket connection

// http://localhost:9000
const socket = io(SOCKET_URL);

socket.on("connect", () => {
  console.log("Connected to the server with socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log(`Disconnected socket ID: ${socket.id}`);
});

export default socket;
