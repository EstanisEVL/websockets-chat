import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log("Server running");
});

const io = new Server(server);

let messages = [];

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  socket.on("autenticated", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", data);
  });
});
