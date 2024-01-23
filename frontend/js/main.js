import {
  sanitizeJSON,
  postToServer,
  parseMealTime,
} from "./utilities/index.js";
import {
  submitRecipe,
  submitState,
  submitMeal,
  submitRecipeReview,
} from "./actions/index.js";
import { recipeIds, createRecipeContainer, loadRecipesForReview } from "./views/index.js";

window.submitRecipeReview = submitRecipeReview;
window.submitRecipe = submitRecipe;
window.submitState = submitState;
window.submitMeal = submitMeal;

// Call the function when the page loads
loadRecipesForReview();
