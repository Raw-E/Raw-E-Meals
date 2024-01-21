import {
  sanitizeJSON,
  postToServer,
  parseMealTime,
} from "./utilities/index.js";
import {
  submitRating,
  submitRecipe,
  submitState,
  submitMeal,
} from "./actions/index.js";
import { createRecipeContainer, loadRecipesForReview } from "./views/index.js";

window.submitRating = submitRating;
window.submitRecipe = submitRecipe;
window.submitState = submitState;
window.submitMeal = submitMeal;

// Call the function when the page loads
loadRecipesForReview();
