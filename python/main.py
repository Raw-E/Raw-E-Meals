# main.py
from openai import OpenAI
from get_output_from_llm import generate_note_from_response
from get_output_from_llm import generate_insightful_question

client = OpenAI()

notes = []

# Number of iterations
num_iterations = 5

for _ in range(num_iterations):
    print(notes)
    print("##############################################")
    question = generate_insightful_question(client, notes)
    user_answer = input(f"AI: {question}\nUser: ")  # Simulate user answering the question

    # Generate a note based on the question and answer
    note = generate_note_from_response(client, question, user_answer)
    notes.append(note)

    print(f"AI Note: {note}")