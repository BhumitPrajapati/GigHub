const userSocketMap = {};

function setupSocket(io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Get userId from query parameters when user connects
        const userId = socket.handshake.query.userId;
        if (userId) {
            // console.log(`User ${userId} connected with socket ${socket.id}`);
            userSocketMap[userId.toString()] = socket.id;

            // Also store by MongoDB ObjectId if provided
            const mongoId = socket.handshake.query.mongoId;
            if (mongoId) {
                // console.log(`Storing additional mapping for MongoDB ID ${mongoId}`);
                userSocketMap[mongoId] = socket.id;
            }

            // Log all current connections
            // console.log("Current user-socket mappings:", userSocketMap);

            // Emit online users to all clients
            io.emit("onlineUsers", Object.keys(userSocketMap));
        }

        // Handle sending messages
        socket.on("sendMessage", async (messageData) => {
            console.log("Socket message received:", messageData);
            const { receiverId, text, image } = messageData;
            if (!userId) {
                console.error("No userId available for sender");
                return;
            }
            const senderId = userId.toString();

            try {
                // Create message in database (you can move this to your controller)
                // const newMessage = {
                //     senderId,
                //     receiverId,
                //     text,
                //     image
                // };

                // Get receiver's socket id from our map
                const receiverSocketId = userSocketMap[receiverId];
                console.log(`Looking for socket ID for receiver ${receiverId}:`, receiverSocketId);

                // If receiver is online, send them the message in real time
                if (receiverSocketId) {
                    console.log(`Emitting message to socket ${receiverSocketId}`);
                    io.to(receiverSocketId).emit("newMessage", {
                        senderId,
                        receiverId,
                        text,
                        image,
                        createdAt: new Date()
                    });
                } else {
                    console.log(`Receiver ${receiverId} is not online`);
                }
            } catch (error) {
                console.error("Error handling message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);

            Object.keys(userSocketMap).forEach(key => {
                if (userSocketMap[key] === socket.id) {
                    console.log(`Removing mapping for user ${key}`);
                    delete userSocketMap[key];
                }
            });

            io.emit("onlineUsers", Object.keys(userSocketMap));
        });
    });

    return { userSocketMap };
}

module.exports = { setupSocket };