// This function submits a user's rating for a recipe to the server
import postToServer from "../utilities/post-to-server.js"; // Importing the function for making a POST request to the server

function submitRecipeReview(recipeId, recipeName, review) {
  // Creating a payload with recipe name and rating
  const payload = {
    recipeId: recipeId,
    review: review,
  };

  // Making a POST request to the server to submit the rating
  postToServer("/recipes/add-recipe-review", payload)
    .then((data) => console.log("Success:", data)) // Logging success message
    .catch((error) => console.error("Error:", error)); // Logging error message
}

export default submitRecipeReview; // Exporting the submitRating function
