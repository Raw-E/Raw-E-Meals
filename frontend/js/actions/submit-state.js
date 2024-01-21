// This function submits the user's state to the server
import postToServer from "../utilities/post-to-server.js"; // Importing the function for making a POST request to the server

function submitState() {
  const stateInput = document.getElementById("stateInput").value;
  const payload = {
    username: "WokeBloke",
    state: stateInput,
  };

  postToServer("/tracking/track-state", payload)
    .then((data) => console.log("Success:", data)) // Logging success message
    .catch((error) => console.error("Error:", error)); // Logging error message
}

export default submitState; // Exporting the submitState function
