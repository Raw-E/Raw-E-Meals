import sys
import re

def extract_recipe_name(text):
    """
    Extracts the recipe name from the given text using a regular expression.

    Parameters:
    text (str): The text from which to extract the recipe name.

    Returns:
    str|None: The extracted recipe name or None if no name is found.
    """
    # Define a regular expression pattern to match the "Recipe Name:" line and capture the name.
    pattern = r"Recipe Name\s*(.*)"

    # Use the re.search() function to find the pattern in the text.
    match = re.search(pattern, text)

    # If a match is found, extract the captured group (the recipe name).
    if match:
        recipe_name = match.group(1).strip()

        # Remove any asterisks from the recipe name.
        recipe_name = recipe_name.replace('*', '')

        return recipe_name
    else:
        return None

def main():
    """
    Main function to read input text and print the extracted recipe name.
    """
    # Read multiple lines into a single string until EOF.
    input_text = sys.stdin.read().strip()
    recipe_name = extract_recipe_name(input_text)

    if recipe_name:
        print(recipe_name)
    else:
        print("Recipe name not found in the text.")

if __name__ == "__main__":
    main()