// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules
const express = require("express");
const cors = require("cors");
const path = require("path"); // Add this line
const { getMongoDBURI, connectToMongoDB } = require("./databases/connect");
const recipeRoutes = require("./routes/recipes");
const trackingRoutes = require("./routes/tracking");

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS only in development environment
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

// Middleware to serve static files from 'frontend' directory
app.use(express.static(path.join(__dirname, "../frontend/html")));
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));

// Initialize the MongoDB connection
(async () => {
  // Get MongoDB URI
  const uri = await getMongoDBURI();

  // Connect to MongoDB
  const mongoClient = await connectToMongoDB(uri);

  // Middleware to attach the mongoClient to each request
  app.use((req, res, next) => {
    req.mongoClient = mongoClient;
    next();
  });

  // Use the routes
  app.use("/recipes", recipeRoutes(mongoClient));
  app.use("/tracking", trackingRoutes(mongoClient));

  // Start the server
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
