// const socket = io();
// socket.on("Connection updated", (count) => {
//   console.log("I received the event", count);
// });

// document.getElementById("add").addEventListener("click", () => {
//   socket.emit("increment");
// });
const socket = io();
socket.on("message", (message) => {
  console.log(message);
});
document.querySelector(".message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const inputSel = document.querySelector(".message-form input");
  const value = inputSel.value;
  inputSel.value = "";
  socket.emit("sendMessage", value);
});
