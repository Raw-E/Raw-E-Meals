// This function submits a new recipe to the server
import postToServer from "../utilities/post-to-server.js"; // Importing the function for making a POST request to the server
import sanitizeJSON from "../utilities/sanitize-JSON.js"; // Importing the function for sanitizing JSON input

function submitRecipe() {
  const recipeJson = document.getElementById("recipeInput").value;
  const sanitizedJson = sanitizeJSON(recipeJson);
  const recipe = JSON.parse(sanitizedJson);

  postToServer("/recipes/add-recipe", recipe)
    .then((data) => console.log("Success:", data)) // Logging success message
    .catch((error) => console.error("Error:", error)); // Logging error message
}

export default submitRecipe; // Exporting the submitRecipe function
