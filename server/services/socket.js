const { Server } = require("socket.io");
let userSocketMap = {}; // Object to map userId to socket.id
let username = "";
function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, // Your frontend URL
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    // When a user connects, store their userId along with socket.id
    socket.on("register_user", ({ userId, userName }) => {
      username = userName;
      console.log(`User active: ${username}`);

      userSocketMap[userId] = socket.id;
    });

    // Remove the mapping when the user disconnects
    socket.on("disconnect", () => {
      for (const [userId, sockId] of Object.entries(userSocketMap)) {
        if (sockId === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
      console.log("A user disconnected socketId: ", socket.id);
      console.log("User disconnected: ", username);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  return io;
}

module.exports = { setupSocket, userSocketMap };
