// import { useState } from "react";
// import { FaSearch, FaEllipsisV, FaPaperPlane } from "react-icons/fa";
// import Navbar from "../components/Navbar/NavBar";

// function Chat() {
//   const [messages, setMessages] = useState([
//     { text: "Hello!", sender: "other" },
//     { text: "Hi, how are you?", sender: "me" },
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (input.trim()) {
//       setMessages([...messages, { text: input, sender: "me" }]);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-zinc-950 text-white">
//       {/* Navbar */}
//       <div className="h-16">
//         <Navbar isAdmin={false} />
//       </div>

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="w-1/4 bg-zinc-950 border-r border-gray-700 p-4 flex flex-col">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Chats</h2>
//             <FaEllipsisV className="text-gray-400 cursor-pointer" />
//           </div>
//           <div className="relative mb-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full px-4 py-2 border border-white-600 bg-zinc-950 text-white rounded-2xl"
//             />
//             <FaSearch className="absolute top-3 right-3 text-gray-400" />
//           </div>
//           <div className="space-y-3 overflow-y-auto">
//             {["Bhumit", "Test", "test2"].map((name) => (
//               <div
//                 key={name}
//                 className="p-4 border border-white-700 rounded-2xl cursor-pointer hover:bg-zinc-950"
//               >
//                 {name}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat Section */}
//         <div className="flex-1 flex flex-col bg-zinc-950">
//           {/* Header */}
//           <div className="h-16 p-4 border-b border-gray-700 bg-zinc-950 flex justify-between items-center">
//             <h3 className="text-lg font-bold">Alice</h3>
//             <FaEllipsisV className="text-gray-400 cursor-pointer" />
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-4 space-y-2 overflow-y-auto">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
//                   }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-3xl max-w-xs break-words ${msg.sender === "me"
//                       ? "bg-white text-black"
//                       : "bg-zinc-800 text-white"
//                     }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="h-16 p-4 border-t border-gray-700 bg-zinc-950 flex items-center">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type a message"
//               className="flex-1 p-2 border border-gray-600 bg-zinc-950 text-white rounded-2xl"
//             />
//             <button
//               onClick={sendMessage}
//               className="ml-2 p-3 bg-zinc-600 text-white rounded-3xl"
//             >
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;


import { useEffect, useState, useRef } from "react";
import { FaSearch, FaEllipsisV, FaPaperPlane } from "react-icons/fa";
import Navbar from "../components/Navbar/NavBar";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import config from "../config/config";
import { getDecodeTokenHook } from '@/hooks/useAuth';
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  isOnline?: boolean;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
}

function Chat() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const decodedToken = getDecodeTokenHook();
  const userId = decodedToken?.userId;
  const mongoId = decodedToken?._id;

  // const _id = decodedToken?._id;
  // console.log("decodeTokem: ", decodedToken._id);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdFromQuery = queryParams.get('userId');

  // Connect to socket.io server when component mounts
  // Modify this part of your existing code
  useEffect(() => {
    if (!userId) return;

    try {
      const socketUrl = config.backendUrl.replace('/api', '').replace(/\/$/, '');
      console.log("Connecting to socket at:", socketUrl);

      const newSocket = io(socketUrl, {
        query: { userId, mongoId },
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        transports: ['websocket', 'polling']
      });

      setSocket(newSocket);

      // Socket event listeners
      newSocket.on("connect", () => {
        console.log("Socket connected successfully");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Connection error: " + error.message);
      });

      // Clean up on unmount
      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error("Socket initialization error:", error);
    }
  }, [userId, mongoId]);

  // Add this NEW useEffect for handling new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // console.log("New message received via socket:", message);

      // Convert IDs to strings for consistent comparison
      const msgSenderId = typeof message.senderId === 'string' ?
        message.senderId : message.senderId;

      const msgReceiverId = typeof message.receiverId === 'string' ?
        message.receiverId : message.receiverId;

      const myId = mongoId?.toString();

      if (selectedUser) {
        const selectedUserId = selectedUser._id?.toString();

        // console.log("Message IDs check:", {
        //   msgSenderId,
        //   msgReceiverId,
        //   myId,
        //   selectedUserId,
        //   isForCurrentChat: (
        //     (msgSenderId === selectedUserId && msgReceiverId === myId) ||
        //     (msgReceiverId === selectedUserId && msgSenderId === myId)
        //   )
        // });

        // Check if this message belongs in the current chat
        if ((msgSenderId === selectedUserId && msgReceiverId === myId) ||
          (msgReceiverId === selectedUserId && msgSenderId === myId)) {
  
          setMessages(prev => [...prev, message]);

          // Scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else {
          console.log("📫 Message is for another chat");
          // Optional: Show a notification for messages not in current chat
          if (msgReceiverId === myId) {
            const sender = users.find(u => u._id === msgSenderId);
            toast.success(`New message from ${sender?.firstName || 'someone'}`);
          }
        }
      } else if (msgReceiverId === myId) {
        // If no chat is open but message is for us
        const sender = users.find(u => u._id === msgSenderId);
        toast.success(`New message from ${sender?.firstName || 'someone'}`);
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Clean up listener when component unmounts or dependencies change
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, mongoId, users]);

  const token = localStorage.getItem('token');
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch users for chat
  useEffect(() => {
    if (!userId) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.backendUrl}/messages/users`, {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          withCredentials: true
        });

        if (response.data && response.data.data) {
          setUsers(response.data.data);

          // If we have a userId from query params, select that user
          if (userIdFromQuery && response.data.data.length > 0) {
            const userToSelect = response.data.data.find((u: User) => u._id === userIdFromQuery);
            if (userToSelect) {
              setSelectedUser(userToSelect);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast.error(error.response?.data?.message || "Failed to load chat users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, userIdFromQuery]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (!selectedUser || !userId) return;

    const fetchMessages = async () => {
      try {

        const response = await axios.get(`${config.backendUrl}/messages/${selectedUser._id}`, {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });

        // console.log("Messages response:", response.data);

        if (response.data && response.data.data) {
          setMessages(response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast.error(error.response?.data?.message || "Failed to load messages");
      }
    };

    fetchMessages();
  }, [selectedUser, userId]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser || !userId) return;

    try {
      // Create a temporary message for optimistic UI update
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        senderId: mongoId as string,
        receiverId: selectedUser._id,
        text: input,
        createdAt: new Date().toISOString()
      };

      // Add to UI immediately
      setMessages(prev => [...prev, tempMessage]);

      // Clear input field
      const messageToBeSent = input;
      setInput('');

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Send to server
      const response = await axios.post(
        `${config.backendUrl}/messages/send/${selectedUser._id}`,
        { text: messageToBeSent },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        }
      );

      // console.log("Send message response:", response.data);

      if (response.data && response.data.data) {
        // Replace temporary message with the real one
        setMessages(prev => prev.map(msg =>
          msg._id === tempMessage._id ? response.data.data : msg
        ));
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");

      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg._id !== `temp-${Date.now()}`));
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar isAdmin={false} />
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
        <div className="flex h-full bg-zinc-950 rounded-2xl overflow-hidden">
          {/* Users List */}
          <div className="w-1/3 border-r border-gray-700 bg-zinc-950 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Chats</h2>
              <FaEllipsisV className="text-gray-400 cursor-pointer" />
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-white-600 bg-zinc-950 text-white rounded-2xl"
              />
              <FaSearch className="absolute top-3 right-3 text-gray-400" />
            </div>
            <div className="space-y-3 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className={`p-4 border rounded-2xl cursor-pointer hover:bg-zinc-800 ${selectedUser && selectedUser._id === user._id ? 'bg-zinc-800' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="text-white">{user.firstName} {user.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  {searchQuery ? "No users matching your search" : "No users available for chat"}
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col bg-zinc-950">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="h-16 border-b border-gray-700 bg-zinc-950 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                  </div>
                  <FaEllipsisV className="text-gray-400 cursor-pointer" />
                </div>

                {/* Messages */}
                {/* Messages with enhanced styling */}
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.length > 0 ? (
                    messages.map((message, index) => {
                      const isMyMessage = message.senderId === mongoId;
                      const prevMsg = index > 0 ? messages[index - 1] : null;
                      const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;

                      // Group consecutive messages from same sender
                      const isConsecutive = prevMsg && prevMsg.senderId === message.senderId;
                      const isFollowedBySameSender = nextMsg && nextMsg.senderId === message.senderId;

                      // Calculate time difference between messages
                      const showTimestamp = !isFollowedBySameSender ||
                        (new Date(nextMsg?.createdAt).getTime() - new Date(message.createdAt).getTime() > 300000); // 5 minutes

                      return (
                        <div
                          key={index}
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${!isConsecutive ? 'mt-4' : 'mt-1'
                            }`}
                        >
                          {/* Avatar for other users, only shown for first message in group */}
                          {!isMyMessage && !isConsecutive && (
                            <div className="h-8 w-8 rounded-full bg-gray-500 mr-2 flex-shrink-0 
                          flex items-center justify-center text-sm">
                              {selectedUser?.firstName?.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className={`flex flex-col ${!isMyMessage && isConsecutive ? 'ml-10' : ''}`}>
                            <div
                              className={`max-w-[260px] p-3 ${isMyMessage
                                ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
                                : 'bg-gray-700 text-white rounded-2xl rounded-bl-none'
                                }`}
                            >
                              {/* Text with proper wrapping */}
                              <p className="whitespace-pre-wrap break-words">
                                {message.text}
                              </p>

                              {message.image && (
                                <img
                                  src={message.image}
                                  alt="Message attachment"
                                  className="mt-2 rounded-lg max-h-40 object-contain"
                                />
                              )}
                            </div>

                            {/* Show timestamp only for last message in group or if time gap is significant */}
                            {showTimestamp && (
                              <div className={`text-xs text-gray-400 mt-1 ${isMyMessage ? 'text-right mr-1' : 'text-left ml-1'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No messages yet. Start a conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <div className="h-16 p-4 border-t border-gray-700 bg-zinc-950 flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message"
                    className="flex-1 p-2 border border-gray-600 bg-zinc-950 text-white rounded-2xl"
                  />
                  <button
                    onClick={sendMessage}
                    className="ml-2 p-3 bg-zinc-600 text-white rounded-3xl hover:bg-zinc-500 transition"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
