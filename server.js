require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const app = express();
app.use(express.json());
app.use(express.static('front-end'));

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

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
