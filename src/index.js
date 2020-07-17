const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
io.on("connection", (socket) => {
  console.log("connected");
  socket.broadcast.emit("message", "A new user has joined");
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });
  socket.on("disconnect", () => {
    io.prependListener("User has left");
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
