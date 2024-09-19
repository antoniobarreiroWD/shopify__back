const { createCheckout, getCheckout } = require("../utils/shopifyApi");

exports.createCheckout = async (req, res) => {
  const { items } = req.body; 

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No hay productos en el carrito" });
  }

  try {
   
    const { checkoutId, webUrl } = await createCheckout(items);

    return res.json({
      checkoutId,
      webUrl,
    });
  } catch (error) {
    console.error("Error al crear el checkout:", error.message);
    return res.status(500).json({ error: "Error al crear el checkout" });
  }
};


exports.getCheckout = async (req, res) => {
  const checkoutId = req.session.checkoutId;

  if (!checkoutId) {
    return res.status(400).json({ error: "No hay un checkout activo" });
  }

  try {
    const checkout = await getCheckout(checkoutId);

    if (!checkout) {
      return res.status(404).json({ error: "Checkout no encontrado" });
    }

    return res.json({
      checkoutId: checkout.id,
      webUrl: checkout.webUrl,
    });
  } catch (error) {
    console.error("Error al recuperar el estado del checkout:", error.message);
    return res.status(500).json({ error: "Error al recuperar el estado del checkout" });
  }
};
