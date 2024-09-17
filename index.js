const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
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
