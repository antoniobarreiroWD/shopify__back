const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;
const session = require("express-session");

app.use(session({
  secret: 'mySecretKey', 
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production' // 'true' solo en producción
  }
}));

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  }));
  
app.use(express.json());

const server = http.createServer(app);

// Configurar Socket.IO
require("./config/socketConfig")(server);


const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");


app.use(cartRoutes);
app.use(productRoutes);
app.use(checkoutRoutes);

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
