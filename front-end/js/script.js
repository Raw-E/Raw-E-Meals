function submitRating() {
  var userInput = document.getElementById('stateInput').value;
  var recipeName = "Coconut Brownies"
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