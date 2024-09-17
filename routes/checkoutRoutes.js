const express = require("express");
const { getCheckout } = require("../controllers/checkoutController");

const router = express.Router();

router.get("/checkout", getCheckout);

module.exports = router;
