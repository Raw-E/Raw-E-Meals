// This file contains the function for submitting the user's meal information to the server
import postToServer from "../utilities/post-to-server.js"; // Importing the function for making a POST request to the server
import parseMealTime from "../utilities/parse-meal-time.js"; // Importing the function for parsing meal time

function submitMeal() {
  // Retrieving the meal input and meal time input from the DOM
  const mealInput = document.getElementById("mealInput").value;
  const mealTimeInput = document.getElementById("mealTimeInput").value;
  
  // Parsing the meal time using the parseMealTime function
  const mealTime = parseMealTime(mealTimeInput);

  // Creating the payload to be sent to the server
  const payload = {
    username: "WokeBloke",
    meal: mealInput,
    time: mealTime,
  };

  // Making a POST request to the server to track the meal
  postToServer("/tracking/track-meal", payload)
    .then((data) => console.log("Success:", data)) // Logging success message
    .catch((error) => console.error("Error:", error)); // Logging error message
}

export default submitMeal; // Exporting the submitMeal function
