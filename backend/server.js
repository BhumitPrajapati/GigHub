const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
// const { server } = require("./lib/socket")
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const { setupSocket } = require("./lib/socket.lib");

const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messagesRoutes = require("./routes/messageRoutes");

const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: "https://gighub-pbj.onrender.com/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PETCH"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/admin/", adminRoutes);
app.use("/api/messages/", messagesRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://gighub-pbj.onrender.com/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  }
});


const { userSocketMap } = setupSocket(io);

app.set('io', io);
app.set('userSocketMap', userSocketMap)

const PORT = 5000;
const resolvedPath = path.resolve;

if (process.env.NODE_ENV === "Production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(resolvedPath, "../frontend", "index.html"))
  })
}

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
