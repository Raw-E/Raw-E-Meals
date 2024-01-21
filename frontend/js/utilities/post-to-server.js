// This utility function posts data to a specified endpoint using the fetch API and returns the response as JSON
async function postToServer(endpoint, payload) {
  // Sending a POST request to the specified endpoint with the provided payload
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Checking if the response is not okay and throwing an error if so
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Returning the response data as JSON
  return response.json();
}

// Exporting the postToServer function to make it accessible to other modules
export default postToServer;
