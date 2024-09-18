const { getCheckout } = require("../utils/shopifyApi");

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

    res.json({
      checkoutId: checkout.id,
      webUrl: checkout.webUrl, 
    });
  } catch (error) {
    console.error("Error al recuperar el estado del checkout:", error.message);
    res.status(500).json({ error: "Error al recuperar el estado del checkout" });
  }
};

