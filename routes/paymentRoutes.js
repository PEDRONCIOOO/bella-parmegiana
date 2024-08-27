const paymentController = require("../controllers/paymentController");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router
  .route("/webhooks")
  .post(authController.validateWebhook, paymentController.startOrder);

router
  .route("/:token")
  .post(paymentController.pay)
  .patch(
    authController.protect,
    authController.restricTo("funcionario", "admin"),
    paymentController.refundOrder
  );

module.exports = router;
