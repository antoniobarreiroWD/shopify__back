module.exports = (server) => {
  const socketIo = require("socket.io");
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", (msg) => {
      console.log("Mensaje recibido: ", msg);
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });
};
