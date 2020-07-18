const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/utils");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("sendMessage", (message) => {
    io.emit("message", generateMessage(message));
  });
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined`));
  });

  socket.on("sendLocation", (coords, cb) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    cb();
  });
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User has left"));
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
