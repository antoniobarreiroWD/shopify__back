const { createCheckout, addToCheckout } = require("../utils/shopifyApi");

let checkoutId = null;

exports.addToCart = async (req, res) => {
  const { variantId, quantity } = req.body;
  console.log("Datos recibidos:", { variantId, quantity });

  try {
    if (!checkoutId) {
      
      const checkoutResponse = await createCheckout(variantId, quantity);
      checkoutId = checkoutResponse.data.data.checkoutCreate.checkout.id;
      return res.json(checkoutResponse.data);
    } else {
      
      const updateResponse = await addToCheckout(checkoutId, variantId, quantity);
      return res.json(updateResponse.data);
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};
