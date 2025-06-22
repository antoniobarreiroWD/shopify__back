const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
  
app.use(express.json());

const server = http.createServer(app);


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