import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./db/dbConnect.js";
import authRoute from "./routes/authroute.js";
import userRoute from "./routes/userRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const server = createServer(app);

const __dirname = path.resolve();

app.use(
  cors({
    origin: "https://firstwebrtcproject.onrender.com/",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://firstwebrtcproject.onrender.com/",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

console.log("Socket.io successfully initialized with CORS");

let onlineUser = [];

io.on("connection", (socket) => {
  console.log(`Info - new Connection ${socket.id}`);

  socket.emit("me", socket.id);

  socket.on("join", (user) => {
    if (!user || !user.id) {
      console.log("Invalid user data on join");
      return;
    }

    socket.join(user.id);
    const existingUser = onlineUser.find((u) => u.userId === user.id);
    if (existingUser) {
      existingUser.socketId = socket.id;
    } else {
      onlineUser.push({
        userId: user.id,
        name: user.name,
        socketId: socket.id,
      });
    }

    io.emit("online-users", onlineUser);
  });

  socket.on("callToUser", (data) => {
    // console.log("Incoming call from -", data)
    const call = onlineUser.find((user) => user.userId === data.callToUserId);

    if (!call) {
      // console.log("call to user Id", call)
      socket.emit("userUnavailable", { message: `${call?.name} is Offline` });
      return;
    }
    io.to(call.socketId).emit("callToUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
      email: data.email,
      profilePic: data.profilePic,
    });
  });

  socket.on("answeredCall", (data) => {
    io.to(data.to).emit("callAccepted", {
      signal: data.signal,
      from: data.from,
    });
  });

  socket.on("callEnded", (data) => {
    io.to(data.to).emit("callEnded", {
      name: data.name,
    });
  });

  socket.on("reject-call", (data) => {
    io.to(data.to).emit("callRejected", {
      name: data.name,
      profilePic: data.profilePic,
    });
  });

  socket.on("disconnect", () => {
    const user = onlineUser.find((u) => u.socketId === socket.id);

    onlineUser = onlineUser.filter((u) => u.socketId !== socket.id);

    io.emit("online-users", onlineUser);

    socket.broadcast.emit("disconnectUser", { disUser: socket.id });

    console.log("Info - Disconnected", socket.id);
  });
});

(async () => {
  try {
    await dbConnect();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
})();
