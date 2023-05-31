const socket = io();

// Swal.fire({
//   title: "Saludos",
//   text: "Mensaje inicial",
//   icon: "success",
// });

let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identifiquese",
  input: "text",
  text: "Ingresa tu nombre de usuario para ingresar al chat",
  inputValidator: (value) => {
    return !value && "Necesitas un nombre de usuario para ingresar al chat";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.emit("autenticated", user);
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message} </br>`;
  });
  log.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    title: `${data} se ha unido al chat`,
    icon: "success",
  });
});
