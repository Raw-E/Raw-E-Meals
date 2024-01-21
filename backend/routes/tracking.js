// Import necessary modules
const express = require("express");
const router = express.Router();
const { trackState, trackMeal } = require("../controllers/trackingController");

// Route to track state
router.post("/track-state", trackState);

// Route to track meal
router.post("/track-meal", trackMeal);

// Exporting a function that takes a mongoClient as an argument
module.exports = (mongoClient) => {
  // Middleware to attach the mongoClient to each request
  router.use((req, res, next) => {
    req.mongoClient = mongoClient;
    next();
  });

  // Error handling middleware
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  // Return the router
  return router;
};
