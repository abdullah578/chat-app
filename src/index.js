const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/utils");
const {
  addUsers,
  removeUser,
  getUsers,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("sendMessage", (message) => {
    const user = getUsers(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, message));
    }
  });
  socket.on("join", ({ username, room }, cb) => {
    const { error, user } = addUsers({ id: socket.id, username, room });
    if (error) return cb(error);
    socket.join(user.room);
    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined`)
      );
  });

  socket.on("sendLocation", (coords, cb) => {
    const user = getUsers(socket.id);
    if (user)
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        )
      );
    cb();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user)
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left`)
      );
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
