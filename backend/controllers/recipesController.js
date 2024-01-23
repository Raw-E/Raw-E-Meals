const { ObjectId } = require('mongodb');

const addRecipeReview = async (req, res) => {
  try {
    console.log("addRecipeReview called with body:", req.body);
    const reviewsCollection = req.mongoClient.db("Meals").collection("Reviews");
    const recipesCollection = req.mongoClient.db("Meals").collection("Recipes");
    const review = req.body.review;
    const recipeId = req.body.recipeId;

    if (!ObjectId.isValid(recipeId)) {
      console.error("Invalid recipeId:", recipeId);
      return res.status(400).json({ message: "Invalid recipeId" });
    }

    console.log("Inserting review:", review);
    const reviewResult = await reviewsCollection.insertOne({ review });
    console.log("Review inserted with result:", reviewResult);

    console.log(`Updating recipe with ID ${recipeId} to add review with ID ${reviewResult.insertedId}`);
    const recipeResult = await recipesCollection.updateOne(
      { _id: new ObjectId(recipeId) },
      { $push: { reviewIds: reviewResult.insertedId } }
    );
    console.log('Update operation result:', recipeResult);

    if (recipeResult.matchedCount === 0) {
      console.error("No recipe found with ID:", recipeId);
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ reviewResult, recipeResult });
  } catch (error) {
    console.error("Error in addRecipeReview:", error);
    res.status(500).json({ message: error.message });
  }
};

// Similar functions would be needed for addVersion, getReviews, and getVersions

const addRecipe = async (req, res) => {
  try {
    const { name, servings, ingredients, instructions, notes } = req.body;
    const recipesCollection = req.mongoClient.db("Meals").collection("Recipes");
    const lastModified = new Date();

    const result = await recipesCollection.insertOne({
      name,
      servings,
      ingredients,
      instructions,
      notes,
      lastModified,
      reviewIds: [], // Initialize ReviewIDs as an empty array
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipes = async (req, res) => {
  console.log("getRecipes called"); // Log when the function is called
  try {
    const recipesCollection = req.mongoClient.db("Meals").collection("Recipes");
    console.log("Connected to collection"); // Log after connecting to the collection
    const recipes = await recipesCollection
      .aggregate([
        {
          $addFields: {
            selectedForReview: { $ifNull: ["$selectedForReview", false] },
          },
        },
        {
          $sort: { lastModified: -1 },
        },
      ])
      .toArray();
    console.log("Recipes fetched", recipes); // Log the fetched recipes
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error); // Log any errors
    res.status(500).json({ message: error.message });
  }
};

const selectForReview = async (req, res) => {
  try {
    const recipesCollection = req.mongoClient.db("Meals").collection("Recipes");
    const recipeName = req.body.recipeName;
    const result = await recipesCollection.updateOne(
      { name: recipeName },
      { $set: { selectedForReview: true } },
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deselectForReview = async (req, res) => {
  try {
    const recipesCollection = req.mongoClient.db("Meals").collection("Recipes");
    const recipeName = req.body.recipeName;
    const result = await recipesCollection.updateOne(
      { name: recipeName },
      { $set: { selectedForReview: false } },
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

console.log("recipesController loaded"); // Log when the file is loaded

module.exports = {
  addRecipeReview,
  addRecipe,
  getRecipes,
  selectForReview,
  deselectForReview,
};
