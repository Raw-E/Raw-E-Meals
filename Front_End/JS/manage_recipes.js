fetch('/get-recipes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    const recipeList = document.getElementById('recipeList');
    data.forEach(recipe => {
      const listItem = document.createElement('li');
      listItem.textContent = recipe.Name;
      listItem.style.cursor = 'pointer';
      listItem.addEventListener('click', function() {
        this.classList.toggle('selected');
        if (this.classList.contains('selected')) {
          this.style.backgroundColor = 'green';
          // Call the endpoint to select the recipe for review
          fetch('/select-for-review', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeName: recipe.Name }),
          })
          .then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch((error) => console.error('Error:', error));
        } else {
          this.style.backgroundColor = '';
          // Call the endpoint to deselect the recipe for review
          fetch('/deselect-for-review', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeName: recipe.Name }),
          })
          .then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch((error) => console.error('Error:', error));
        }
      });
      // If the recipe is selected, set the background color to green
      if (recipe.selectedForReview) {
        listItem.classList.add('selected');
        listItem.style.backgroundColor = 'green';
      }
      recipeList.appendChild(listItem);
    });
  })
  .catch((error) => console.error('Error:', error));