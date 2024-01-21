require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const app = express();
app.use(express.json());
app.use(express.static('Front_End'));

// Configure CORS for development environment
if (process.env.NODE_ENV === 'development') {
  const cors = require('cors');
  app.use(cors());
}

console.log("Checkpoint 1")

// Function to access MongoDB URI from Secret Manager
async function getMongoDBURI() {
  if (process.env.NODE_ENV === 'production') {
    const secretsClient = new SecretManagerServiceClient();

    try {
      const [version] = await secretsClient.accessSecretVersion({
        name: 'projects/882775215945/secrets/mongodb-uri/versions/latest',
      });
      const mongoURI = version.payload.data.toString('utf8');

      return mongoURI;
    } catch (error) {
      console.error("Error fetching MongoDB URI from Secret Manager:", error.message);
      throw error;
    }
  } else {
    // Fallback to .env file for development
    console.log("Using local MongoDB URI from .env");
    return process.env.MONGODB_URI;
  }
}

// Function to connect to MongoDB
async function connectToMongoDB(uri) {
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    process.exit(1);
  }
}

// Initialize the MongoDB connection
(async () => {
  console.log("Checkpoint 2")
  const uri = await getMongoDBURI();
  const mongoClient = await connectToMongoDB(uri);

  // Define your routes here, using `mongoClient`
  app.post('/rate-recipe', async (req, res) => {
    try {
      const recipesCollection = mongoClient.db("Meals").collection("Ratings");
      const rating = req.body.rating; // Assuming 'rating' contains the rating
      // Removed the line that gets recipeId from the request body
      const recipeName = req.body.recipeName; // Add this line to get the recipe name from the request body
  
      // Insert the new recipe with the rating and name
      const result = await recipesCollection.insertOne(
        { name: recipeName, ratings: [rating] } // Changed from updateOne to insertOne
      );
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/add-recipe', async (req, res) => {
    try {
      // Extract the properties from the request body
      const { Name, Servings, Ingredients, Instructions, Notes } = req.body;
  
      // Get the recipes collection from your MongoDB client
      const recipesCollection = mongoClient.db("Meals").collection("Recipes");

      const lastModified = new Date();
  
      // Insert the new recipe into the collection
      const result = await recipesCollection.insertOne({ Name, Servings, Ingredients, Instructions, Notes, lastModified });
  
      // Respond with a 201 status code for "Created" and the result
      res.status(201).json(result);
    } catch (error) {
      // If something goes wrong, respond with a 500 status code and the error message
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/track-state', async (req, res) => {
    try {
      const statesCollection = mongoClient.db("Beings").collection("States");
      const username = req.body.username;
      const state = req.body.state;
  
      // Get current date and time
      const timestamp = new Date();
  
      // Insert the document with the timestamp
      const result = await statesCollection.insertOne({ 
        username: username, 
        state: state, 
        timestamp: timestamp // Adding the timestamp field
      });
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/track-meal', async (req, res) => {
    try {
      const mealsCollection = mongoClient.db("Beings").collection("Meals");
      const username = req.body.username;
      const meal = req.body.meal;
      const timestamp = req.body.time;

      console.log(meal)
  
      // Insert the document with the timestamp
      const result = await mealsCollection.insertOne({ 
        username: username, 
        meal: meal, 
        timestamp: timestamp // Adding the timestamp field
      });
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/get-recipes', async (req, res) => {
    try {
      const recipesCollection = mongoClient.db("Meals").collection("Recipes");
      const recipes = await recipesCollection.aggregate([
        {
          $addFields: {
            selectedForReview: { $ifNull: ["$selectedForReview", false] }
          }
        },
        {
          $sort: { lastModified: -1 }
        }
      ]).toArray();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/select-for-review', async (req, res) => {
    try {
      const recipesCollection = mongoClient.db("Meals").collection("Recipes");
      const recipeName = req.body.recipeName;
      const result = await recipesCollection.updateOne(
        { Name: recipeName },
        { $set: { selectedForReview: true } }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/deselect-for-review', async (req, res) => {
    try {
      const recipesCollection = mongoClient.db("Meals").collection("Recipes");
      const recipeName = req.body.recipeName;
      const result = await recipesCollection.updateOne(
        { Name: recipeName },
        { $set: { selectedForReview: false } }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
