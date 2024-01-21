import submitRating from "../actions/submit-rating.js";

// This function creates and returns a div element containing the recipe details and a form for submitting a rating
function createRecipeContainer(recipe) {
  // Creating a new div element for the recipe container
  const recipeContainer = document.createElement("div");

  // Creating a new h5 element for the recipe name
  const header = document.createElement("h5");
  header.textContent = recipe.Name;

  // Creating a new input element for the rating
  const input = document.createElement("input");
  input.type = "text";
  input.style.fontSize = "0.8em";
  input.placeholder = `Describe to the AI in 1 sentence or less!`;

  // Creating a new button element for submitting the rating
  const button = document.createElement("button");
  button.textContent = "Submit Rating";
  button.style.fontSize = "0.8em";
  button.onclick = function () {
    submitRating(recipe.Name, input.value);
  };

  // Appending the header, input, and button elements to the recipe container
  recipeContainer.appendChild(header);
  recipeContainer.appendChild(input);
  recipeContainer.appendChild(button);

  // Returning the recipe container
  return recipeContainer;
}

export default createRecipeContainer;
