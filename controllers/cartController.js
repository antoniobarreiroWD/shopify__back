const { createCheckout, addToCheckout } = require("../utils/shopifyApi");

exports.addToCart = async (req, res) => {
  const { variantId, quantity } = req.body;
  let checkoutId = req.session.checkoutId; 

  console.log("Datos recibidos:", { variantId, quantity, checkoutId });

  try {
    let response;

   
    if (checkoutId) {
      console.log(`Añadiendo al checkout existente: ${checkoutId}`);
      response = await addToCheckout(checkoutId, variantId, quantity);

      return res.json({
        message: "Producto añadido al checkout existente",
        checkout: {
          id: checkoutId,
          lineItems: response.data.data.checkoutLineItemsAdd.checkout.lineItems.edges,
        },
      });
    } else {
      
      console.log("Creando un nuevo checkout");
      response = await createCheckout(variantId, quantity);
      const newCheckoutId = response.data.data.checkoutCreate.checkout.id;

     
      req.session.checkoutId = newCheckoutId;

      return res.json({
        message: "Checkout creado",
        checkoutId: newCheckoutId,
        checkout: {
          id: newCheckoutId,
          lineItems: response.data.data.checkoutCreate.checkout.lineItems.edges,
        },
      });
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};

