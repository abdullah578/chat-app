const elements = {
  messageForm: document.querySelector(".message-form"),
  messageInput: document.querySelector(".message-form input"),
  locationButton: document.querySelector(".location"),
  sideBar: document.querySelector(".chat__sidebar"),
  messageTemplate: document.querySelector("#message-template"),
  messageList: document.querySelector("#message-list"),
  locationTemplate: document.querySelector("#location-template"),
  sideBarTemplate: document.querySelector("#sideBar-content"),
};
const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
socket.on("roomData", (content) => {
  const html = Mustache.render(elements.sideBarTemplate.innerHTML, content);
  elements.sideBar.innerHTML = html;
});
socket.on("message", (message) => {
  const html = Mustache.render(elements.messageTemplate.innerHTML, {
    message: message.text,
    timeStamp: moment(message.createdAt).format("h:mm a"),
    username: message.username,
  });
  elements.messageList.insertAdjacentHTML("beforeend", html);
});
socket.on("locationMessage", (loc) => {
  const html = Mustache.render(elements.locationTemplate.innerHTML, {
    location: loc.url,
    timeStamp: moment(loc.createdAt).format("h:mm a"),
    username: message.username,
  });
  elements.messageList.insertAdjacentHTML("beforeend", html);
});
elements.messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = elements.messageInput.value;
  elements.messageInput.value = "";
  socket.emit("sendMessage", value);
});

elements.locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  elements.locationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        elements.locationButton.removeAttribute("disabled");
        console.log("Location has been shared");
      }
    );
  });
});
