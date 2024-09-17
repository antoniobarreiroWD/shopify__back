const { getCheckout } = require("../utils/shopifyApi");

exports.getCheckout = async (req, res) => {
  try {
    const checkout = await getCheckout(checkoutId); 
    res.json({ 
      checkoutId: checkout.id, 
      webUrl: checkout.webUrl, 
      totalPrice: checkout.totalPriceV2 
    });
  } catch (error) {
    console.error("Error al recuperar el estado del checkout:", error.message);
    res.status(500).json({ error: "Error al recuperar el estado del checkout" });
  }
};

