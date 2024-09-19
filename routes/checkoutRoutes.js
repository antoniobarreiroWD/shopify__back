const express = require("express");
const { createCheckout, getCheckout } = require("../controllers/checkoutController");

const router = express.Router();


router.get("/checkout", getCheckout);


router.post("/checkout", createCheckout);

module.exports = router;
