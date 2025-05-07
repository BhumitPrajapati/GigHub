const { resMsg } = require("../../middleware/authMiddleware");
const UserInfo = require("../../models/UserInfo");
// const Messages1 = require("../../models/message");
const Messages = require("../../models/Message");

const getUsersFromSideBar = async (req, res) => {
    try {
        const logedInUserId = req.user._id;
        const filteredUsers = await UserInfo.find({ _id: { $ne: logedInUserId }, role: { $ne: "admin" }, }).select("-password");

        resMsg(res, "Succesfull fetch users", filteredUsers, null, 200, "api/messages/users")
    } catch (error) {
        console.log(error);
        resMsg(res, "Something went wrong", null, null, 500, "api/messages/users")
    }
}

const getMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id;
        const myId = req.user._id;
        const message = await Messages.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        // Convert ObjectIds to strings for consistent client handling
        const formattedMessages = message.map(msg => ({
            _id: msg._id.toString(),
            senderId: msg.senderId.toString(),
            receiverId: msg.receiverId.toString(),
            text: msg.text,
            image: msg.image,
            createdAt: msg.createdAt
        }));
        // console.log(Messages1);

        resMsg(res, "successfullly fetch data", formattedMessages, null, 200, "/api/messages/id");
    } catch (error) {
        console.log(error);
        resMsg(res, "Something went wrong", null, null, 500, "/api/messages/id");
    }
}

const sendMessages = async (req, res) => {
    try {
        const { text } = req.body;
        const image = req.file ? req.file.path : null;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const receiver = await UserInfo.findById(receiverId);
        if (!receiver) {
            return resMsg(res, "Receiver not found", null, null, 404, "/api/messages/send/id");
        }
        const receiverUserId = receiver.userId;
        
        const newMsg = new Messages({
            senderId,
            receiverId,
            text,
            image
        })

        const savedMessage = await newMsg.save();
        const io = req.app.get('io'); // Access io instance from app
        const userSocketMap = req.app.get('userSocketMap') || {};
        let receiverSocketId = null;

 
        if (userSocketMap) {
            if (userSocketMap[receiverId.toString()]) {
                receiverSocketId = userSocketMap[receiverId.toString()];
            }
            else if (userSocketMap[receiverUserId]) {
                receiverSocketId = userSocketMap[receiverUserId];
            }
            // Try plain receiverId (in case it's already a string)
            else if (userSocketMap[receiverId]) {
                receiverSocketId = userSocketMap[receiverId];
            }
        }

        if (io && receiverSocketId) {
            const messageToSend = {
                _id: savedMessage._id.toString(),
                senderId: savedMessage.senderId.toString(),
                receiverId: savedMessage.receiverId.toString(),
                text: savedMessage.text,
                image: savedMessage.image,
                createdAt: savedMessage.createdAt
            };
            io.to(receiverSocketId).emit("newMessage", messageToSend);
        } else {
            console.log(`Receiver ${receiverId}/${receiverUserId} is not online or socket not found`);
        }
        resMsg(res, "successfullly fetch data", savedMessage, null, 200, "/api/messages/send/id");
    } catch (error) {
        console.log(error);
        resMsg(res, "Something went wrong", null, null, 500, "/api/messages/send/id");
    }
}

module.exports = { getUsersFromSideBar, getMessages, sendMessages };