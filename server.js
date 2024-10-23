const express = require("express");
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    path: '/socket.io'
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChannel", (channel) => {
    socket.join(channel);
    console.log(`User ${socket.id} joined channel: ${channel}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get('/', (req, res) => {
  return res.send("Gasal's Communication Server, (TaskManager V.1.0)")
})

app.post("/event-trigger", async (req, res) => {
  const { channel, event, data } = await req.body;
  console.log(`Emitting event: ${event}, to channel: ${channel} with data: ${data}`);

  io.to(channel).emit(event, data);

  res.status(200).json({
    success: true,
    message: `Event ${event} triggered in channel ${channel}`,
  });
});

server.listen(3001, () => {
    console.log("NOTIFICATION SERVER IS UP AND RUNNING.")
})
