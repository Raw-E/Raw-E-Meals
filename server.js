// server.js
require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Environment variables
const uri = process.env.MONGODB_URI || "mongodb+srv://wokebloke:<password>@servingbeings.nni9vnv.mongodb.net/?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

const app = express();
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    process.exit(1);
  }
}

// Add a recipe to the 'Recipes' collection
app.post('/recipes', async (req, res) => {
  try {
    const recipesCollection = client.db("Meals").collection("Recipes");
    const result = await recipesCollection.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

// Retrieve all recipes from the 'Recipes' collection
app.get('/recipes', async (req, res) => {
  try {
    const recipesCollection = client.db("Meals").collection("Recipes");
    const recipes = await recipesCollection.find({}).toArray();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server and connect to MongoDB
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectToMongoDB();
});
