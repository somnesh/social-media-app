const { Server } = require("socket.io");
const redisClient = require("../utils/redisClient");
const User = require("../models/User"); // Import User model

let userSocketMap = {}; // Object to map userId to socket.id

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("register_user", async ({ userId, userName }) => {
      console.log(`User active: ${userName}`);

      // Store in both memory and Redis
      userSocketMap[userId] = socket.id;

      // Join user's own room
      socket.join(`user:${userId}`);

      // Set user online with TTL (expires in 30 seconds)
      await redisClient.setex(`user:${userId}:status`, 30, "online");
      await redisClient.set(`user:${userId}:socketId`, socket.id);

      // Broadcast to THIS user's room (their followers will receive this)
      io.to(`user:${userId}`).emit("user_status_changed", {
        userId,
        status: "online",
      });
    });

    // Subscribe to specific users' status (only when needed)
    socket.on("subscribe_to_users", async ({ userIds }) => {
      if (!userIds || !Array.isArray(userIds)) return;

      // Join rooms of users you want to monitor
      userIds.forEach((userId) => {
        socket.join(`user:${userId}`);
      });

      // Return current status of these users
      const statuses = {};
      for (const userId of userIds) {
        const status = await redisClient.get(`user:${userId}:status`);
        statuses[userId] = status || "offline";
      }

      socket.emit("users_status_batch", statuses);
    });

    // Unsubscribe from users
    socket.on("unsubscribe_from_users", ({ userIds }) => {
      if (!userIds || !Array.isArray(userIds)) return;

      userIds.forEach((userId) => {
        socket.leave(`user:${userId}`);
      });
    });

    // Heartbeat to keep status alive
    socket.on("heartbeat", async ({ userId }) => {
      await redisClient.setex(`user:${userId}:status`, 30, "online");
    });

    // When user follows someone new
    socket.on("follow_user", ({ followedUserId }) => {
      socket.join(`user:${followedUserId}`);
    });

    // When user unfollows someone
    socket.on("unfollow_user", ({ unfollowedUserId }) => {
      socket.leave(`user:${unfollowedUserId}`);
    });

    socket.on("disconnect", async () => {
      // Find userId from socket.id
      let disconnectedUserId = null;
      for (const [userId, sockId] of Object.entries(userSocketMap)) {
        if (sockId === socket.id) {
          disconnectedUserId = userId;
          delete userSocketMap[userId];
          break;
        }
      }

      if (disconnectedUserId) {
        // Set offline status
        await redisClient.set(`user:${disconnectedUserId}:status`, "offline");
        await redisClient.del(`user:${disconnectedUserId}:socketId`);

        // Broadcast offline status to user's room (their followers)
        io.to(`user:${disconnectedUserId}`).emit("user_status_changed", {
          userId: disconnectedUserId,
          status: "offline",
        });

        console.log(`User ${disconnectedUserId} disconnected`);
      }
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

// Helper function to check user status
async function getUserStatus(userId) {
  const status = await redisClient.get(`user:${userId}:status`);
  return status || "offline";
}

// Helper function to get all online users
async function getOnlineUsers() {
  const keys = await redisClient.keys("user:*:status");
  const onlineUsers = [];

  for (const key of keys) {
    const status = await redisClient.get(key);
    if (status === "online") {
      const userId = key.split(":")[1];
      onlineUsers.push(userId);
    }
  }

  return onlineUsers;
}

// Helper to get status of multiple users (for followers list)
async function getMultipleUserStatuses(userIds) {
  const statuses = {};

  for (const userId of userIds) {
    const status = await redisClient.get(`user:${userId}:status`);
    statuses[userId] = status || "offline";
  }

  return statuses;
}

module.exports = {
  setupSocket,
  userSocketMap,
  getUserStatus,
  getOnlineUsers,
  getMultipleUserStatuses,
};
