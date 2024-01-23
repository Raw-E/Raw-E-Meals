import createRecipeContainer from "./create-recipe-container.js";

export let recipeIds = [];

// This function loads the recipes for review from the server
function loadRecipesForReview() {
  // Fetching the recipes from the server
  fetch("/recipes/get-recipes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // Checking if the response is not okay and throwing an error if so
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parsing the response data as JSON
      return response.json();
    })
    .then((data) => {
      // Checking if the data is not an array and throwing an error if so
      if (!Array.isArray(data)) {
        throw new Error("Data received from server is not an array");
      }
      // Getting the recipe names container from the DOM
      const recipeNamesContainer = document.getElementById("recipeNames");
      // Iterating over the recipes
      data.forEach((recipe) => {
        // Checking if the recipe is selected for review
        if (recipe.selectedForReview) {
          // Creating a new recipe container for the recipe
          const recipeContainer = createRecipeContainer(recipe);
          // Appending the recipe container to the recipe names container
          recipeNamesContainer.appendChild(recipeContainer);

          // Accessing the _id of the recipe
          const id = recipe._id;
          // Push the id into the recipeIds array
          recipeIds.push(id);
        }
      });
    })
    .catch((error) => console.error("Error:", error)); // Logging any errors that occur
}

export default loadRecipesForReview;