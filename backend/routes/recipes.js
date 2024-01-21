// Import necessary modules
const express = require("express");
const router = express.Router();
const {
  rateRecipe,
  addRecipe,
  getRecipes,
  selectForReview,
  deselectForReview,
} = require("../controllers/recipesController");

module.exports = (mongoClient) => {
  // Middleware to attach the mongoClient to each request
  router.use(async (req, res, next) => {
    try {
      req.mongoClient = mongoClient;
      next();
    } catch (err) {
      next(err);
    }
  });

  // Error handling middleware
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  // Route to rate a recipe
  router.post("/rate-recipe", rateRecipe);

  // Route to add a new recipe
  router.post("/add-recipe", addRecipe);

  // Route to get all recipes
  router.get("/get-recipes", getRecipes);

  // Route to select a recipe for review
  router.post("/select-for-review", selectForReview);

  // Route to deselect a recipe for review
  router.post("/deselect-for-review", deselectForReview);

  return router;
};
