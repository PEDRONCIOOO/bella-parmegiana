const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();


router
  .route("/")
  .get(recipeController.getAllPlates)
  .post(
    authController.protect,
    authController.restricTo("admin"),
    recipeController.uploadRecipeImage,
    recipeController.resizeRecipeImage,
    recipeController.createPlate
  );

router
  .route("/:id")
  .get(recipeController.getPlate)
  .patch(authController.restricTo("admin"), recipeController.updatePlate)
  .delete(authController.restricTo("admin"), recipeController.deletePlate);

module.exports = router;
