// controllers/recipesController.js
const rateRecipe = async (req, res) => {
  try {
    const recipesCollection = req.mongoClient.db("Meals").collection("Ratings");
    const rating = req.body.rating;
    const recipeName = req.body.recipeName;

    const result = await recipesCollection.insertOne({
      name: recipeName,
      ratings: [rating],
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { Name, Servings, Ingredients, Instructions, Notes } = req.body;
    const recipesCollection = req.mongoClient.db("Meals").collection("Recipes");
    const lastModified = new Date();

    const result = await recipesCollection.insertOne({
      Name,
      Servings,
      Ingredients,
      Instructions,
      Notes,
      lastModified,
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
      { Name: recipeName },
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
      { Name: recipeName },
      { $set: { selectedForReview: false } },
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

console.log("recipesController loaded"); // Log when the file is loaded

module.exports = {
  rateRecipe,
  addRecipe,
  getRecipes,
  selectForReview,
  deselectForReview,
};
