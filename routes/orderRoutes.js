const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router.post(
  "/validateOrder",
  authController.stopDuringClosingHours,
  orderController.validateOrder
);

router
  .route("/:token")
  .get(authController.isLoggedIn, orderController.getOrder)
  .patch(
    authController.protect,
    authController.restricTo("funcionario", "admin"),
    orderController.updateOrderStatus
  );

router
  .route("/")
  .get(
    authController.protect,
    authController.restricTo("funcionario", "admin"),
    orderController.getOrdersFromPastWeek
  )
  .post(authController.isLoggedIn, orderController.createOrder);

module.exports = router;
