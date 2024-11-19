import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Initialize the socket connection
const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log("Connected to the server with socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log(`Disconnected socket ID: ${socket.id}`);
});

export default socket;
