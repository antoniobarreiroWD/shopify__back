# Shopify Integration Backend

Este proyecto proporciona un backend completo para integrar tiendas de Shopify con aplicaciones personalizadas. Permite manejar productos, carritos de compra y checkouts a través de las APIs de Shopify.

## 🚀 Características

- Integración con Shopify Admin API y Storefront API
- Gestión de productos y variantes
- Sistema de carrito de compras
- Proceso de checkout
- Comunicación en tiempo real mediante Socket.IO
- Arquitectura modular y extensible

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- Una tienda Shopify (Plan de Desarrollo o superior)
- Credenciales de API de Shopify:
  - Access Token de Admin API
  - Access Token de Storefront API
  - URL de tu tienda Shopify

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd ec_back
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
SHOPIFY_STORE_URL=tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_admin_access_token
SHOPIFY_STOREFRONT_ACCESS_TOKEN=tu_storefront_access_token
PORT=3000
```

4. Inicia el servidor:
```bash
npm start
```

## 🛠️ Estructura del Proyecto

```
├── config/
│   └── socketConfig.js     # Configuración de Socket.IO
├── controllers/
│   ├── cartController.js   # Lógica del carrito
│   ├── checkoutController.js # Lógica del checkout
│   └── productController.js  # Lógica de productos
├── routes/
│   ├── cartRoutes.js      # Rutas del carrito
│   ├── checkoutRoutes.js  # Rutas de checkout
│   └── productRoutes.js   # Rutas de productos
├── utils/
│   └── shopifyApi.js      # Utilidades para API Shopify
├── index.js              # Punto de entrada
└── package.json
```

## 📡 API Endpoints

### Productos
- `GET /api/products` - Obtener lista de productos
- `GET /api/products/:id` - Obtener detalles de un producto

### Carrito
- `POST /api/cart` - Añadir item al carrito
- `GET /api/cart` - Obtener contenido del carrito
- `DELETE /api/cart/:id` - Eliminar item del carrito

### Checkout
- `POST /api/checkout` - Crear nuevo checkout
- `GET /api/checkout/:id` - Obtener estado del checkout

## 🔌 Eventos Socket.IO

El proyecto utiliza Socket.IO para mantener actualizados los carritos en tiempo real:

- `cart:update` - Emitido cuando se actualiza el carrito
- `checkout:created` - Emitido cuando se crea un nuevo checkout
- `checkout:updated` - Emitido cuando se actualiza un checkout

## 🛡️ Configuración de Shopify

1. Ve al panel de administración de tu tienda Shopify
2. Navega a Apps > Desarrollar apps
3. Crea una nueva app
4. Configura los permisos necesarios:
   - `read_products`
   - `write_checkouts`
   - `read_orders`
5. Genera los tokens de acceso necesarios

## 🔐 Seguridad

- Todas las credenciales deben almacenarse en variables de entorno
- Los tokens de acceso nunca deben compartirse o commitarse al repositorio
- Se recomienda implementar rate limiting en producción
- Utilizar HTTPS en producción

## 📦 Dependencias Principales

- express: Framework web
- socket.io: Comunicación en tiempo real
- axios: Cliente HTTP
- dotenv: Manejo de variables de entorno
- cors: Middleware CORS
- express-session: Manejo de sesiones

## 📫 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue o contactar al equipo de desarrollo.
