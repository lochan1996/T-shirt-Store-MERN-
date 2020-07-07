const express = require("express");
const router = express.Router();

const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/paymentB")
const { getUserById } = require("../controllers/user")
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated,getToken)

router.post("/payment/braintree/:userId", isSignedIn, isAuthenticated, processPayment)

router.param("userId", getUserById);

module.exports = router;