function submitState() {
  var userInput = document.getElementById('stateInput').value;
  console.log("User's state of being since last meal:", userInput);

  // Send a POST request to the server
  fetch('/state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state: userInput }),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}