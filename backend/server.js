const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const { setupSocket } = require("./lib/socket.lib");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messagesRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();

const _dirname = path.resolve();
app.use(cookieParser());

const Url = process.env.URL;

const corsOptions = {
  origin: Url,
  // origin: "http://localhost:5173",
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
    origin: Url,
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  }
});

const { userSocketMap } = setupSocket(io);

app.set('io', io);
app.set('userSocketMap', userSocketMap)

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5029;
server.listen(PORT, () => {
  console.log(`Backend running on ${Url}`);
});