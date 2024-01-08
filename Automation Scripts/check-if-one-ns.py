import sys
import re

def count_ns_commands(text):
    """
    Counts the occurrences of the "/ns" command in the given text.

    Parameters:
    text (str): The text in which to count the "/ns" commands.

    Returns:
    int: The number of occurrences of the "/ns" command.
    """
    pattern = r"/ns"
    matches = re.findall(pattern, text)
    return len(matches)

def main():
    """
    Main function to read input text and print True if the '/ns' command
    appears exactly once, and False otherwise.
    """
    input_text = sys.stdin.read().strip()
    ns_command_count = count_ns_commands(input_text)

    # Print True if '/ns' occurs exactly once, False otherwise
    print(ns_command_count == 1)

if __name__ == "__main__":
    main()