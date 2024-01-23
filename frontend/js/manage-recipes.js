// Fetch all recipes from the server
console.log("here 1");


fetch("/recipes/get-recipes", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    console.log("Response:", response);
    if (
      response.ok &&
      response.headers.get("Content-Type").includes("application/json")
    ) {
      console.log("here 2");
      return response.json();
    } else {
      throw new Error("Server response was not ok or not JSON");
    }
  })
  .then((data) => {
    if (Array.isArray(data)) {
      console.log("Data:", data);
      // Get the recipe list element
      const recipeList = document.getElementById("recipeList");

      console.log("here 3");

      // Iterate over each recipe
      data.forEach((recipe) => {
        // Create a new list item for each recipe
        
        const listItem = document.createElement("li");
        listItem.textContent = recipe.name;
        listItem.style.cursor = "pointer";

        // Add a click event listener to each list item
        listItem.addEventListener("click", function () {
          this.classList.toggle("selected");

          // If the recipe is selected, change the background color and call the select endpoint
          if (this.classList.contains("selected")) {
            this.style.backgroundColor = "green";
            selectOrDeselectRecipe("/recipes/select-for-review", recipe.name);
          } else {
            // If the recipe is deselected, reset the background color and call the deselect endpoint
            this.style.backgroundColor = "";
            selectOrDeselectRecipe("/recipes/deselect-for-review", recipe.name);
          }
        });

        // If the recipe is already selected, set the background color to green
        if (recipe.selectedForReview) {
          listItem.classList.add("selected");
          listItem.style.backgroundColor = "green";
        }

        // Add the list item to the recipe list
        recipeList.appendChild(listItem);
      });
    } else {
      throw new Error("Data received from server is not an array");
    }
  })
  .catch((error) => console.error("Error:", error));

// Function to select or deselect a recipe for review
function selectOrDeselectRecipe(endpoint, recipeName) {
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipeName: recipeName }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Success:", data))
    .catch((error) => console.error("Error:", error));
}
