const axios = require("axios");

// Convertir variantId a global ID
const getGlobalVariantId = (variantId) => {
  return Buffer.from(`gid://shopify/ProductVariant/${variantId}`).toString('base64');
};


exports.getProducts = async () => {
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2023-04/products.json`;
  const response = await axios.get(shopifyUrl, {
    headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN }
  });
  return response.data;
};

exports.createCheckout = async (items) => {
  const shopifyCheckoutUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

 
  const lineItems = items.map(item => `
    { variantId: "${getGlobalVariantId(item.variantId)}", quantity: ${item.quantity} }
  `).join(',');

  try {
    
    const response = await axios.post(shopifyCheckoutUrl, {
      query: `
        mutation {
          checkoutCreate(input: {
            lineItems: [${lineItems}]
          }) {
            checkout {
              id
              webUrl
              lineItems(first: 10) {
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
      `,
    }, {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        "Content-Type": "application/json"
      },
    });

   
    if (response.data.errors) {
      console.error("Error en la respuesta de Shopify:", response.data.errors);
      throw new Error("Error en la consulta GraphQL");
    }

    
    if (response.data && response.data.data && response.data.data.checkoutCreate) {
      const checkoutId = response.data.data.checkoutCreate.checkout.id;
      const webUrl = response.data.data.checkoutCreate.checkout.webUrl;

      return { checkoutId, webUrl };
    } else {
      console.error("Error: Respuesta inesperada de Shopify", response.data);
      throw new Error("Respuesta inesperada de Shopify");
    }

  } catch (error) {
    console.error("Error al crear el checkout:", error.message);

    
    if (error.response) {
      console.error("Detalles del error en la respuesta HTTP:", error.response.data);
    } else if (error.request) {
      
      console.error("No hubo respuesta del servidor:", error.request);
    } else {
     
      console.error("Error durante la configuración de la solicitud:", error.message);
    }
    throw error;
  }
};




exports.addToCheckout = async (checkoutId, variantId, quantity) => {
  const globalVariantId = getGlobalVariantId(variantId);
  const shopifyCheckoutUpdateUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

  return axios.post(shopifyCheckoutUpdateUrl, {
    query: `
      mutation {
        checkoutLineItemsAdd(checkoutId: "${checkoutId}", lineItems: [
          { variantId: "${globalVariantId}", quantity: ${quantity} }
        ]) {
          checkout {
            id
            lineItems(first: 10) {
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
    `,
  }, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      "Content-Type": "application/json"
    },
  });
};


exports.getCheckout = async (checkoutId) => {
  const shopifyCheckoutUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

  try {
    const response = await axios.post(shopifyCheckoutUrl, {
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

    
    if (response.data.data.node.lineItems) {
      return response.data.data.node;
    } else {
      return {
        id: checkoutId,
        webUrl: response.data.data.node.webUrl,
        totalPriceV2: response.data.data.node.totalPriceV2,
        lineItems: { edges: [] } 
      };
    }
  } catch (error) {
    console.error("Error en la API de Shopify:", error.message);
    throw error;
  }
};
