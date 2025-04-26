// // const { Server } = require("socket.io");
// // const http = require("http");
// // const express = require("express");

// // const app = express();
// // const server = http.createServer(app);

// // const io = new Server(server, {
// //     cors: {
// //         origin: ["http://localhost:5173"], // Allow requests from your frontend
// //     },
// // });

// // // Used to store online users
// // const userSocketMap = {}; // { userId: socketId }

// // function getReceiverSocketId(userId) {
// //     return userSocketMap[userId];
// // }

// // io.on("connection", (socket) => {
// //     console.log("A user connected", socket.id);

// //     const userId = socket.handshake.query.userId;
// //     if (userId) userSocketMap[userId] = socket.id;

// //     // Emit the list of online users to all connected clients
// //     io.emit("getOnlineUsers", Object.keys(userSocketMap));

// //     socket.on("disconnect", () => {
// //         console.log("A user disconnected", socket.id);
// //         delete userSocketMap[userId];
// //         io.emit("getOnlineUsers", Object.keys(userSocketMap));
// //     });
// // });

// // module.exports =  { io, app, server, getReceiverSocketId };
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173", // Your frontend URL
//         credentials: true,
//     },
// });

// // Example: Handle socket connections
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     socket.on("disconnect", () => {
//         console.log("A user disconnected:", socket.id);
//     });
// });

// module.exports = { server, io };