def generate_note_from_response(client, question, answer):
    """
    This function takes a question that was asked to the user, the user's answer, and uses GPT to generate a note.
    It specifies the roles in the conversation to make it clear that the user was asked a question and then provided an answer.
    
    :param client: An instance of the OpenAI client.
    :param question: The question that was asked to the user.
    :param answer: The answer given by the user.
    :return: A note generated based on the interaction.
    """
    # Provide a system-level instruction for the model
    system_instruction = "Generate a concise note that summarizes or interprets the user's response to the following question."

    # Structure the conversation context for the model
    messages = [
        {"role": "system", "content": system_instruction},
        {"role": "user", "content": f"The user was asked by AI: '{question}'"},
        {"role": "user", "content": f"The user responded: '{answer}'"}
    ]

    # Query the model to generate a note
    response = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo"
    )

    # Extract and return the generated note from the response
    note = response.choices[0].message.content.strip()
    return note

def generate_insightful_question(client, user_context):
    """
    Generates an insightful question about the user based on the provided context.
    
    :param user_context: A string containing information or context about the user.
    :return: An insightful question aimed at gaining deeper understanding of the user.
    """
    prompt = (f"Based on the following information about a user, generate a thoughtful and insightful question "
              f"to learn more about them:\n\nUser Context: {user_context}\n\nGenerate Question:")

    messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
    ]

    response = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo"
    )

    question = response.choices[0].message.content.strip()
    return question


