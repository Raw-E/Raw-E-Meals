// This function parses the user input for meal time and returns a Date object representing the parsed time
function parseMealTime(mealTimeInput) {
  // Creating a new Date object to represent the meal time
  const mealTime = new Date();

  // Extracting hours and minutes from the input and converting them to numbers
  const [hours, minutes] = mealTimeInput.split(":").map(Number);

  // Setting the hours and minutes of the mealTime object
  mealTime.setHours(hours);
  mealTime.setMinutes(minutes);

  // Returning the mealTime object
  return mealTime;
}

// Exporting the parseMealTime function to make it accessible to other modules
export default parseMealTime;