const express = require("express");
const axios = require("axios");
const http = require('http');
const socketIo = require("socket.io");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Variable para almacenar el checkout ID
let checkoutId = null;

app.get("/", (req, res) => {
  res.send("Backend funcionando con Socket.IO");
});

// Ruta para obtener productos desde Shopify
app.get("/products", async (req, res) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2023-04/products.json`;
  try {
    const response = await axios.get(shopifyUrl, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener productos de Shopify:", error.message);
    res.status(500).json({ error: "Error al obtener productos de Shopify" });
  }
});

// Crear un nuevo checkout o agregar productos al carrito existente
app.post("/add-to-cart", async (req, res) => {
  const { variantId, quantity } = req.body;
  console.log("Datos recibidos:", { variantId, quantity });

  try {
    // Convertir el variantId a Global ID en Base64
    const globalVariantId = Buffer.from(`gid://shopify/ProductVariant/${variantId}`).toString('base64');
    console.log("Global Variant ID:", globalVariantId);

    // Verifica si ya existe un checkout
    if (!checkoutId) {
      // Si no existe un checkout, creamos uno nuevo usando la API Storefront
      const shopifyCheckoutUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

      const checkoutResponse = await axios.post(shopifyCheckoutUrl, {
        query: `
          mutation {
            checkoutCreate(input: {
              lineItems: [{ variantId: "${globalVariantId}", quantity: ${quantity} }]
            }) {
              checkout {
                id
                lineItems(first: 5) {
                  edges {
                    node {
                      title
                      quantity
                    }
                  }
                }
              }
            }
          }
        `
      }, {
        headers: {
          "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          "Content-Type": "application/json"
        },
      });

      console.log("Checkout creado:", checkoutResponse.data);

      // Guardamos el checkout ID para futuras solicitudes
      checkoutId = checkoutResponse.data.data.checkoutCreate.checkout.id;

      res.json(checkoutResponse.data);
    } else {
      // Si ya existe un checkout, agregamos productos al checkout existente
      const shopifyCheckoutUpdateUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

      const updateResponse = await axios.post(shopifyCheckoutUpdateUrl, {
        query: `
          mutation {
            checkoutLineItemsAdd(checkoutId: "${checkoutId}", lineItems: [
              { variantId: "${globalVariantId}", quantity: ${quantity} }
            ]) {
              checkout {
                id
                lineItems(first: 5) {
                  edges {
                    node {
                      title
                      quantity
                    }
                  }
                }
              }
            }
          }
        `
      }, {
        headers: {
          "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          "Content-Type": "application/json"
        },
      });

      console.log("Producto añadido al checkout:", updateResponse.data);

      res.json(updateResponse.data);
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

app.get("/checkout", async (req, res) => {
  try {
    // Verificar que exista un checkout ID
    if (!checkoutId) {
      return res.status(400).json({ error: "No hay un checkout activo" });
    }

    // URL para consultar el checkout actual
    const shopifyCheckoutUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

    const checkoutResponse = await axios.post(shopifyCheckoutUrl, {
      query: `
        query {
          node(id: "${checkoutId}") {
            ... on Checkout {
              id
              webUrl
              totalPriceV2 {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    }, {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        "Content-Type": "application/json"
      },
    });

    // Mostrar la respuesta completa para depuración
    console.log("Respuesta completa del checkout:", JSON.stringify(checkoutResponse.data, null, 2));

    // Asegurarnos de que la respuesta contiene los datos del checkout
    if (!checkoutResponse.data || !checkoutResponse.data.data || !checkoutResponse.data.data.node) {
      return res.status(500).json({ error: "No se pudo recuperar el estado del checkout" });
    }

    // Devolver los detalles del checkout
    res.json(checkoutResponse.data.data.node);

  } catch (error) {
    console.error("Error al recuperar el estado del checkout:", error.message);
    res.status(500).json({ error: "Error al recuperar el estado del checkout" });
  }
});






// Configuración de Socket.IO
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

// Inicialización del servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
