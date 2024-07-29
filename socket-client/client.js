import { io } from "socket.io-client";

const socket = io("http://localhost:5005");

// Register user
socket.emit("register", "userId");

/* // Listen for notifications
socket.on("new-product", (data) => {
  console.log("New product notification:", data);
}); */

/* socket.on("new-discount", (data) => {
  console.log("New discount notification:", data);
}); */

/* socket.on("inactive-user", (data) => {
  console.log("Inactive user notification:", data);
}); */
