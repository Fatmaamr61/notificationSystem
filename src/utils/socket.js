// socket.js
import { Server } from "socket.io";

const users = new Map();
let io; // Declare io variable at the top

export function setupSocket(server) {
  io = new Server(server, {
    cors: "*",
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("register", (userId) => {
      users.set(userId, { socketId: socket.id, lastLogin: new Date() });
      console.log(`User ${userId} registered`);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      for (const [userId, user] of users.entries()) {
        if (user.socketId === socket.id) {
          users.delete(userId);
          console.log(`User ${userId} unregistered`);
        }
      }
    });
  });

  return io;
}

export function notifyUsers(event, data) {
  if (io) {
    for (const user of users.values()) {
      io.to(user.socketId).emit(event, data);
    }
  } else {
    console.error("Socket.io instance is not initialized.");
  }
}

export function checkInactiveUsers() {
  if (io) {
    const now = new Date();
    for (const [userId, user] of users.entries()) {
      if ((now - user.lastLogin) / (1000 * 60 * 60 * 24) > 2) {
        io.to(user.socketId).emit("inactive-user", {
          message: "You have not logged in for 2 days",
        });
      }
    }
  } else {
    console.error("Socket.io instance is not initialized.");
  }
}

setInterval(checkInactiveUsers, 3600000); // Check every hour
