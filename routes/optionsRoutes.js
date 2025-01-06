const optionsController = require("../controllers/optionsController");
const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router.use(authController.protect, authController.restricTo("admin"));

router
  .route("/")
  .get(optionsController.getAllOptions)
  .post(optionsController.createOptions);

router
  .route("/:id")
  .get(optionsController.getOptions)
  .patch(optionsController.updateOptions)
  .delete(optionsController.delteOptions);

module.exports = router;
