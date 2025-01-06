const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/confirmEmail/:token", authController.confirmEmail);

// All routes bellow are protected
router.use(authController.protect);

router.patch(
  "/updateMyPassword",

  authController.updatePassword
);

router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", authController.deleteMe);

router
  .route("/addresses")
  .post(userController.createAddress)
  .delete(userController.deleteAddress);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

setInterval(authController.deleteUnconfirmedUsers, 1000 * 60 * 60 * 24);

module.exports = router;
