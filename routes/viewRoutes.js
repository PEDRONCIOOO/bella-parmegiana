const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getHome);

router.get("/menu", authController.isLoggedIn, viewsController.getMenu);

router.get(
  "/checkout/:token",
  authController.stopDuringClosingHours,
  authController.isLoggedIn,
  viewsController.getCheckOutInfo
);

router.get(
  "/checkout-finish/:id",
  authController.isLoggedIn,
  viewsController.getCheckoutFinish
);
router.get(
  "/checkout-fail",
  authController.isLoggedIn,
  viewsController.getCheckoutFail
);
router.get(
  "/checkout-payment/:id",
  authController.stopDuringClosingHours,
  authController.isLoggedIn,
  viewsController.getCheckoutPayment
);

router.get("/me", authController.protect, viewsController.getAccount);

router.get(
  "/enderecos",
  authController.protect,
  viewsController.getAccountAdresses
);

// router.get("/pedidos", authController.protect, viewsController.getMyOrders);

router.get(
  "/employee-orders",
  authController.protect,
  authController.restricTo("funcionario", "admin"),
  viewsController.getEmployeeOrders
);

router.get(
  "/admin-menu-add",
  authController.protect,
  authController.restricTo("admin"),
  viewsController.getAdminMenu
);
router.get(
  "/admin-menu-edit",
  authController.protect,
  authController.restricTo("admin"),
  viewsController.getAdminMenuEdit
);

router.get("/resetPassword/:token", viewsController.getResetPassword);

router.get("/confirmEmail/:token", viewsController.getEmailConfirm);

module.exports = router;
