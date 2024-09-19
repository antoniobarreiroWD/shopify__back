const { getProducts } = require("../utils/shopifyApi");

exports.getProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos de Shopify:", error.message);
    res.status(500).json({ error: "Error al obtener productos de Shopify" });
  }
};