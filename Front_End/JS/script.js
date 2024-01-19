function sanitizeJSON(input) {
  // Replace single quotes with double quotes
  let sanitized = input.replace(/'/g, '"');

  // Add double quotes around any unquoted keys
  sanitized = sanitized.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

  // Remove trailing commas from arrays and objects
  sanitized = sanitized.replace(/,\s*([}\]])/g, '$1');

  return sanitized;
}

function submitRating() {
  var userInput = document.getElementById('stateInput').value;
  var recipeName = "Coconut Brownies V2"
  console.log("User's rating", userInput);

  // Send a POST request to the server
  fetch('/rate-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating: userInput, recipeName: recipeName }),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

function submitRecipe() {
  var recipeJson = document.getElementById('recipeInput').value;
  var sanitizedJson = sanitizeJSON(recipeJson);
  var recipe = JSON.parse(recipeJson);

  // Send a POST request to the server
  fetch('/add-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}