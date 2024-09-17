const axios = require("axios");

// convertir variantId a global ID
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

exports.createCheckout = async (variantId, quantity) => {
  const globalVariantId = getGlobalVariantId(variantId);
  const shopifyCheckoutUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

  return axios.post(shopifyCheckoutUrl, {
    query: `
      mutation {
        checkoutCreate(input: {
          lineItems: [{ variantId: "${globalVariantId}", quantity: ${quantity} }]
        }) {
          checkout {
            id
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
};

exports.getCheckout = async (checkoutId) => {
  const shopifyCheckoutUrl = `https://${process.env.SHOPIFY_STORE_URL}/api/2023-04/graphql.json`;

  return axios.post(shopifyCheckoutUrl, {
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
};
