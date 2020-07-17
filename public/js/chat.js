const elements = {
  messageForm: document.querySelector(".message-form"),
  messageInput: document.querySelector(".message-form input"),
  locationButton: document.querySelector(".location"),
  messageTemplate: document.querySelector("#message-template"),
  messageList: document.querySelector("#message-list"),
  locationTemplate: document.querySelector("#location-template"),
};
const socket = io();
socket.on("message", (message) => {
  const html = Mustache.render(elements.messageTemplate.innerHTML, {
    message: message.text,
    timeStamp: moment(message.createdAt).format("h:mm a"),
  });
  elements.messageList.insertAdjacentHTML("beforeend", html);
});
socket.on("locationMessage", (loc) => {
  const html = Mustache.render(elements.locationTemplate.innerHTML, {
    location: loc.url,
    timeStamp: moment(loc.createdAt).format("h:mm a"),
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
