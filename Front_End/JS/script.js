function sanitizeJSON(input) {
  let sanitized = input.replace(/'/g, '"');
  sanitized = sanitized.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  sanitized = sanitized.replace(/,\s*([}\]])/g, '$1');
  return sanitized;
}

function submitRating() {
  var userInput = document.getElementById('ratingInput').value; // Changed the id to 'ratingInput'
  var recipeName = "Coconut Brownies V2"
  console.log("User's rating", userInput);

  fetch('/rate-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipeName: recipeName, rating: userInput }),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

function submitRecipe() {
  var recipeJson = document.getElementById('recipeInput').value;
  var sanitizedJson = sanitizeJSON(recipeJson);
  var recipe = JSON.parse(sanitizedJson); // Changed to use 'sanitizedJson' instead of 'recipeJson'

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

function submitState() {
  var stateInput = document.getElementById('stateInput').value;

  fetch('/track-state', { // Assuming you have a '/track-state' endpoint on your server
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: "WokeBloke", state: stateInput }),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

function submitMeal() {
  var mealInput = document.getElementById('mealInput').value;
  var mealTimeInput = document.getElementById('mealTimeInput').value;

  // Get the current date
  var mealTime = new Date();

  // Replace the time portion of the current date with the user's input
  mealTime.setHours(mealTimeInput.split(':')[0]);
  mealTime.setMinutes(mealTimeInput.split(':')[1]);

  fetch('/track-meal', { // Assuming you have a '/track-state' endpoint on your server
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: "WokeBloke", meal: mealInput, time: mealTime }),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

function loadRecipesForReview() {
  fetch('/get-recipes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    const recipeNamesContainer = document.getElementById('recipeNames');
    data.forEach(recipe => {
      if (recipe.selectedForReview) {
        const recipeContainer = document.createElement('div');
        const header = document.createElement('h5');
        header.textContent = recipe.Name;
        const input = document.createElement('input');
        input.type = 'text';
        input.style.fontSize = '0.8em';
        input.placeholder = `Describe to the AI in 1 sentence or less!`;
        const button = document.createElement('button');
        button.textContent = 'Submit Rating';
        button.style.fontSize = '0.8em';
        button.onclick = function() {
          // Call the endpoint to submit the rating
          fetch('/rate-recipe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeName: recipe.Name, rating: input.value }),
          })
          .then(response => {
            // Clear the input box and change the button color to red after the rating is submitted
            input.value = '';
            button.style.backgroundColor = 'red';
            return response.json();
          })
          .then(data => console.log('Success:', data))
          .catch((error) => console.error('Error:', error));
        };
        recipeContainer.appendChild(header);
        recipeContainer.appendChild(input);
        recipeContainer.appendChild(button);
        recipeNamesContainer.appendChild(recipeContainer);
      }
    });
  })
  .catch((error) => console.error('Error:', error));
}

// Call the function when the page loads
loadRecipesForReview();