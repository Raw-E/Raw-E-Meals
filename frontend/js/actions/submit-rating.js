// This function submits a user's rating for a recipe to the server
import postToServer from "../utilities/post-to-server.js"; // Importing the function for making a POST request to the server

function submitRating(recipeName, rating) {
  // Creating a payload with recipe name and rating
  const payload = {
    recipeName: recipeName,
    rating: rating,
  };

  // Making a POST request to the server to submit the rating
  postToServer("/recipes/rate-recipe", payload)
    .then((data) => console.log("Success:", data)) // Logging success message
    .catch((error) => console.error("Error:", error)); // Logging error message
}

export default submitRating; // Exporting the submitRating function
